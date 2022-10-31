import { useLeafletContext } from "@react-leaflet/core";
import { useEffect } from "react";

const ClusterGroup = ({ cluster, children }) => {
  const context = useLeafletContext();
  useEffect(() => {
    const container = context.layerContainer || context.map;
    container.addLayer(cluster);
    return () => {
      container.removeLayer(cluster);
    };
  }, []);

  return <div>{children}</div>;
};

export default ClusterGroup;
