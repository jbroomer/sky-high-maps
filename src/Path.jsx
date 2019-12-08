import { MapLayer, withLeaflet } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

class Path extends MapLayer {
  createLeafletElement() {
    const { map, waypoints, setRouteControl, setGeoPath } = this.props;
    console.log(waypoints)
    let leafletElement = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        serviceUrl: `https://skyhighmaps.pagekite.me/route/v1`,
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