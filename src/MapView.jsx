import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
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
    this.setElevation = this.setElevation.bind(this);

    this.state = {
      currPosition: [0, 0],
      elevation: 0,
      zoom: 3,
      customMarker: false,
      mapMarkers: [],
      currPath: null,
      routeControl: null
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
      navigator.geolocation.getCurrentPosition(this.setElevation);
    }
  }

  setRouteControl = (routeControl) => {
    this.setState({ routeControl: routeControl });
  }

  setLocation = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;    
    this.setState({ currPosition: [lat, lng], zoom:12 });
  }

  setElevation = position => {
    fetch('/api/elevation', {
      method: "POST",
      mode: "cors",
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow", 
      referrer: "no-referrer", 
      body: JSON.stringify({longitude: position.coords.longitude, latitude: position.coords.latitude})
  }).then(function (response) {
    return response.json();
  }).then( jsonResponse => {
        this.setState({elevation: JSON.parse(jsonResponse.response)[0].elevation})
        console.log('elevation', this.state.elevation)
      });
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
      console.log(this.state.routeControl);
      this.map.leafletElement.removeControl(this.state.routeControl);
    }
    if(this.state.mapMarkers.length === MAX_NUM_MARKERS) {
      const { mapMarkers } = this.state;
      const fromLoc = [mapMarkers[0].props.position.lat, mapMarkers[0].props.position.lng];
      const toLoc = [mapMarkers[1].props.position.lat, mapMarkers[1].props.position.lng];
      this.setState({ currPath: (<Path map={this.map} setRouteControl={this.setRouteControl} fromLoc={fromLoc} toLoc={toLoc}/>),
                      mapMarkers: []});
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
