import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CanvasMarker from "./CanvasMarker";
import "leaflet-area-select";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster-src";
import ClusterGroup from "./ClusterGroup";
import AreaSelector from "./AreaSelector";
import { useEffect, useState } from "react";

const MapComponent = () => {
  const markers = [
    { lat: 1.4, lng: 103.69, id: 1, name: "Marker 1" },
    { lat: 1.35, lng: 103.7, id: 2, name: "Marker 2" },
    { lat: 1.334, lng: 103.67, id: 3, name: "Marker 3" },
  ];

  const cluster = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
  });

  const [selectionArea, setSelectionArea] = useState([]);

  useEffect(() => {
    console.log("SelectionArea", selectionArea);
  }, [selectionArea]);

  return (
    <MapContainer
      preferCanvas={true}
      bounds={[
        [1.404753, 103.6920359],
        [1.3004753, 104.0120359],
      ]}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl={false}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='<img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
        url="https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png"
      />
      <AreaSelector setSelectionArea={setSelectionArea} />
      <ClusterGroup cluster={cluster}>
        {markers.map((marker) => (
          <CanvasMarker
            cluster={cluster}
            lat={marker.lat}
            lng={marker.lng}
            iconMode={"accessible"}
            key={marker.id}
          />
        ))}
      </ClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
