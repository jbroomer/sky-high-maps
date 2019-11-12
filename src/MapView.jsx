import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import MapMarker from './MapMarker';
import Path from './Path';
import './MapView.css';

const MAX_NUM_MARKERS = 2;

export default class MapView extends React.Component{
  constructor(props) {
    super(props);
    this.setLocation = this.setLocation.bind(this);
    this.renderPositionMarker = this.renderPositionMarker.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this._renderPath = this._renderPath.bind(this);
    this.setRouteControl = this.setRouteControl.bind(this);
    this.setGeoPath = this.setGeoPath.bind(this);
    
    this.state = {
      currPosition: [0, 0],
      zoom: 3,
      customMarker: false,
      mapMarkers: [],
      currPath: null,
      routeControl: null,
      geoPath: null
    }
  }
  saveMap = map => {
    this.map = map;
    this.setState({
      isMapInit: true
    });
  };

  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation);
    }
  }

  setRouteControl = (routeControl) => {
    this.setState({ routeControl: routeControl });
  }

  setGeoPath = (geoPath) => {
    this.setState({ geoPath: geoPath });
  }

  setLocation = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;    
    this.setState({ currPosition: [lat, lng], zoom:12 });
  }

  onMapClick = (e) => {
    const { mapMarkers } = this.state;
    const id=mapMarkers.length+1;
    const position = e.latlng;
    let newMarker = {};

    if( mapMarkers.length === MAX_NUM_MARKERS) {
      this.setState({ mapMarkers: [], customMarker: true });
    }
    else {
      newMarker = <MapMarker key={id} id={id} position={position}/>;
      this.setState({ mapMarkers: [...mapMarkers, newMarker], customMarker: true});
    }
    this._renderPath();
  }

  //
  renderPositionMarker = () => {
    if(this.state.customMarker || (this.state.currPosition[0] === 0 && this.state.currPosition[1] === 0)) {
      return;
    }
    return <MapMarker position={this.state.currPosition}/>;
  }

  /**
   * Renders path object passing in location props from the current markers
   * and a callback function to retrieve the RoutControl created for later deletion
   */
  _renderPath = () => {
    if(this.state.routeControl) {
      this.map.leafletElement.removeControl(this.state.routeControl);
    }
    if(this.state.mapMarkers.length === MAX_NUM_MARKERS) {
      const { mapMarkers } = this.state;
      const fromLoc = [mapMarkers[0].props.position.lat, mapMarkers[0].props.position.lng];
      const toLoc = [mapMarkers[1].props.position.lat, mapMarkers[1].props.position.lng];
      this.setState({ 
        currPath: (<Path 
                      map={this.map}
                      setRouteControl={this.setRouteControl}
                      setGeoPath={this.setGeoPath}
                      fromLoc={fromLoc}
                      toLoc={toLoc}/>),
                      mapMarkers: []
        });
      }
    else {
      this.setState({ currPath: null });
    }
  }

  render() {
    return(
      <Map onClick={this.onMapClick} className="map" center={this.state.currPosition} zoom={this.state.zoom} ref={this.saveMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {this.renderPositionMarker()}
        {this.state.mapMarkers}
        <div>
          {this.state.currPath}
        </div>
      </Map>
    )
  }
};
