import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './MapView.css';


export default class MapView extends React.Component{
  constructor(props) {
    super(props);
    this.setLocation = this.setLocation.bind(this);
    this.renderPositionMarker = this.renderPositionMarker.bind(this);
    this.state = {
      currPosition: [0, 0],
      zoom: 3
    }
  }
  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation);
    }
  }

  setLocation = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
  
    this.setState({ currPosition: [lat, lng], zoom:12 });
  }

  renderPositionMarker = () => {
    if(this.state.currPosition[0] === 0 && this.state.currPosition[1] === 0) {
      return;
    }
    return (
      <Marker position={this.state.currPosition}>
        <Popup>
          Dis you
        </Popup>
      </Marker>
    );
  }
  render() {
    return(
        <Map className="map" center={this.state.currPosition} zoom={this.state.zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.renderPositionMarker()}
        </Map>
    )
  }
};
