import { latLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const AreaSelector = ({ setSelectionArea }) => {
  const map = useMap();

  console.log(map, map.selectArea);
  useEffect(() => {
    if (!map.selectArea) return;
    map.selectArea.enable();
    map.selectArea.setShiftKey(true);

    map.on("areaselected", (e) => {
      const northEast = e.bounds._northEast;
      const southWest = e.bounds._southWest;
      const northWest = latLng(northEast.lat, southWest.lng);
      const southEast = latLng(southWest.lat, northEast.lng);
      const rectBounds = [northWest, northEast, southEast, southWest];
      setSelectionArea(rectBounds);
    });
  }, []);
  return null;
};

export default AreaSelector;
