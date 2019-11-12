import { MapLayer, withLeaflet } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

class Path extends MapLayer {
  createLeafletElement() {
    const { map, fromLoc, toLoc, setRouteControl, setGeoPath } = this.props;
    let leafletElement = L.Routing.control({
      waypoints: [L.latLng(fromLoc[0], fromLoc[1]), L.latLng(toLoc[0], toLoc[1])],
      showAlternatives: true,
      router: L.Routing.osrmv1({
        serviceUrl: `http://127.0.0.1:5000/route/v1`,
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

export default withLeaflet(Path);