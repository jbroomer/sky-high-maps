import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import './'

export default class MapMarker extends React.Component {
  render() {
    return (
      <Marker id={this.props.id} position={this.props.position}>
        <Popup>
          Marker {this.props.id}
        </Popup>
      </Marker>
    )
  }
}