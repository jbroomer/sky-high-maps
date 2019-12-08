import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import MapMarker from './MapMarker';
import Path from './Path';
import Loading from './Loading';
import ElevationGraph from './elevation-graph';
import MapDirectionsToggle from './MapDirectionsToggle';
import NavBar from './NavBar';
import './MapView.css';
const MAX_NUM_MARKERS = 2;

export default class MapView extends React.Component{
  constructor(props) {
    super(props);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.renderPath = this.renderPath.bind(this);
    this.setRouteControl = this.setRouteControl.bind(this);
    this.setGeoPath = this.setGeoPath.bind(this);
    this.getAllElevations = this.getAllElevations.bind(this);
    this.addMapMarker = this.addMapMarker.bind(this);
    this.handleElevationGraphOpen = this.handleElevationGraphOpen.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.state = {
      loading: false,
      loadingPercent: 0,
      currPosition: [0, 0],
      elevationDisabled: true,
      pathDisabled: true,
      zoom: 3,
      mapMarkers: [],
      currPath: null,
      routeControl: null,
      geoPath: null,
      elevationGraphOpen: false
    }
  }
  saveMap = map => {
    this.map = map;
  };
  /**
   * When the component mounts prompt user for location access and set current
   * location if granted
  */
  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setCurrentLocation);
    }
  }

  // Callback function to store reference to path for later removal
  setRouteControl = (routeControl) => {
    this.setState({ routeControl: routeControl });
  }

  // Stores array of latlng points along calculated path and calls method to retrieve elevations
  setGeoPath = (geoPath) => {
    const addGeoPath = new Promise((res) => {
      this.setState({ geoPath: geoPath, loading: true });
      if(this.state.geoPath === geoPath) {
        res('Success')
      }
    })
    addGeoPath.then(() => {
      this.getAllElevations();
    })
  }

  // Finds and sets current location on map
  setCurrentLocation = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;    
    this.setState({ currPosition: [lat, lng], zoom:12 }, () => {
      this.map.leafletElement.setView([lat, lng], 12)
      this.addMapMarker(L.latLng(lat, lng));
    });
  }

  // API used to retrieve elevation data which is then stored in state
  getAllElevations = () => {
    const { geoPath } = this.state;
    let elevationPath = [];
    if(geoPath) {
      //Populate array path array with altitude info
      const elevationPromise = new Promise((res, rej) => {
        (geoPath.coordinates).map((coordinates) => {
          fetch(`https://nationalmap.gov/epqs/pqs.php?x=${coordinates.lng}&y=${coordinates.lat}&units=Feet&output=json`, {
        }).then((response) => {
          return response.json();
        }).then((jsonResponse) => {
            elevationPath.push({
              lat: coordinates.lat,
              lng: coordinates.lng,
              altitude: jsonResponse.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation
            })
            if(elevationPath.length >= geoPath.coordinates.length-10) {
              this.setState({ loading: false, loadingPercent: 0 });
              res('Success');
            } else {
              const percent = Math.floor(elevationPath.length/geoPath.coordinates.length*100);
              this.setState({ loadingPercent: percent })
            }
          });
       })
      }).catch((err) => {
        console.log(err);
      })
      elevationPromise.then(() => {
        this.setState({ geoAltitudePath: elevationPath });
      })
    }
  }

  /**
   * Adds a marker to the map at a specified location
   * @position an L.latLng object
   */
  addMapMarker = (position) => {
    // If a path is already created, clear map before creating new markers
    if(this.state.geoPath) {
      this.clearMap();
    }
    const { mapMarkers } = this.state;
    const id=mapMarkers.length+1;
    let newMarker = {};
    newMarker = <MapMarker key={id} id={id} position={position}/>;
    this.setState({ mapMarkers: [...mapMarkers, newMarker] }, () => {
      if(this.state.pathDisabled && this.state.mapMarkers.length >= MAX_NUM_MARKERS) {
        this.setState({ pathDisabled: false });
      }
    });
  }

  // Handle map clicks by adding markers at specified locations
  onMapClick = (e) => {
    const position = e.latlng;
    this.addMapMarker(position);
  }

  // Clear map of all markings/stored data
  clearMap = () => {
    if(this.state.routeControl) {
      this.map.leafletElement.removeControl(this.state.routeControl);
    }
    this.setState({
      loading: false,
      loadingPercent: 0,
      elevationDisabled: true,
      pathDisabled: true,
      mapMarkers: [],
      currPath: null,
      routeControl: null,
      geoPath: null,
      elevationGraphOpen: false
    })
  }
  // Helper function to handle opening/closing of elevation graph
  handleElevationGraphOpen = () => {
    this.setState({ elevationGraphOpen: !this.state.elevationGraphOpen });
  }

  /**
   * Renders path object passing in location props from the current markers
   * and a callback function to retrieve the RoutControl created for later deletion
   */
  renderPath = () => {
    const { mapMarkers } = this.state;
    if(this.state.routeControl) {
      this.map.leafletElement.removeControl(this.state.routeControl);
      this.clearMap();
    }
    const waypoints = mapMarkers.map((loc) => {
      return L.latLng(loc.props.position.lat, loc.props.position.lng);
    })
    this.setState({ 
      currPath: (<Path 
                    map={this.map}
                    setRouteControl={this.setRouteControl}
                    setGeoPath={this.setGeoPath}
                    waypoints={waypoints}
                    />),
                    mapMarkers: [],
                    elevationDisabled: false,
      });
  }

  render() {
    return(
      <div className={this.state.loading ? "loading" : ''}>
        {this.state.loading ? <Loading percent = {this.state.loadingPercent}/> : ''}
        <NavBar 
          map={this.map}
          setMapMarker={this.addMapMarker}
          setCurrentLocation={this.setCurrentLocation}
          elevationDisabled={this.state.elevationDisabled}
          handleElevationGraphOpen={this.handleElevationGraphOpen}
          pathDisabled={this.state.pathDisabled}
          renderPath={this.renderPath}
          clearMap={this.clearMap}
        />
        {this.state.routeControl ? <MapDirectionsToggle 
                                    directionsContainer={this.state.routeControl._container}
                                    directionsContainerClass={this.state.routeControl._container.getAttribute('class')}
                                    /> : ''}
        <Map 
          onClick={this.onMapClick}
          className="map"
          center={this.state.currPosition}
          zoom={this.state.zoom} 
          ref={this.saveMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.state.mapMarkers}
          <div>
            {this.state.currPath}
            {this.state.geoAltitudePath ? 
              <ElevationGraph
                open={this.state.elevationGraphOpen}
                data={this.state.geoAltitudePath}
                handleElevationGraphOpen={this.handleElevationGraphOpen}
                /> : ''
            }
          </div>
        </Map>
      </div>
    )
  }
};
