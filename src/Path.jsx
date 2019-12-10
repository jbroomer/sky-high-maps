import { MapLayer, withLeaflet } from "react-leaflet";
import L from "leaflet";
import PropTypes from 'prop-types';
import pathOptions from './path-options';
import "leaflet-routing-machine";

const elevationUrls = {
  short: 'https://skyhighmaps.pagekite.me',
  min: 'https://osrm-skyhighmaps.pagekite.me',
  max: 'https://elevation-skyhighmaps.pagekite.me'
}

const selectUrl = (selectedOption) => {
  switch(selectedOption) {
    case pathOptions.shortestPath:
      return elevationUrls.short;
    case pathOptions.minElevation:
      return elevationUrls.min;
    case pathOptions.maxElevation:
      return elevationUrls.max;
    default:
      return elevationUrls.short;
  }

}

class Path extends MapLayer {
  createLeafletElement() {
    const { map, waypoints, setRouteControl, setGeoPath, selectedOption } = this.props;
    let leafletElement = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        serviceUrl: `${selectUrl(selectedOption)}/route/v1`,
        geometry: 'geojson'
    }),
    }).addTo(map.leafletElement);

    setRouteControl(leafletElement);
    //console.log(leafletElement.getPlan()['_events']);
    leafletElement.on('routeselected', function(routes) {
      setGeoPath(routes.route);
      console.log(routes);
    }, this);

    return leafletElement.getPlan();
  }
}
Path.propTypes = {
  selectedOption: PropTypes.string,
}
export default withLeaflet(Path);