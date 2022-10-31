import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useEffect } from "react";

//? CUSTOM REACT LEAFLET COMPONENT
const CanvasMarker = (props) => {
  // Source code extracted from leaflet-canvas-markers (https://github.com/lipton-ice-tea/leaflet-canvas-markers)
  // This creates custom element in leaflet called CanvasMarker that extends CircleMarker properties.
  L.Canvas.include({
    _updateImg(layer) {
      const { img } = layer.options;
      const p = layer._point.round();
      p.x += img.offset.x;
      p.y += img.offset.y;
      if (img.rotate) {
        this._ctx.save();
        this._ctx.translate(p.x, p.y);
        this._ctx.rotate((img.rotate * Math.PI) / 180);
        this._ctx.drawImage(
          img.el,
          -img.size[0] / 2,
          -img.size[1] / 2,
          img.size[0],
          img.size[1]
        );
        this._ctx.restore();
      } else {
        this._ctx.drawImage(
          img.el,
          p.x - img.size[0] / 2,
          p.y - img.size[1] / 2,
          img.size[0],
          img.size[1]
        );
      }
    },
  });

  const angleCrds = (map, prevLatlng, latlng) => {
    if (!latlng || !prevLatlng) return 0;
    const pxStart = map.project(prevLatlng);
    const pxEnd = map.project(latlng);
    return (
      (Math.atan2(pxStart.y - pxEnd.y, pxStart.x - pxEnd.x) / Math.PI) * 180 -
      90
    );
  };
  const defaultImgOptions = {
    rotate: 0,
    size: [40, 40],
    offset: { x: 0, y: 0 },
  };
  const CanvasMarker = L.CircleMarker.extend({
    _updatePath() {
      if (!this.options.img || !this.options.img.url) return;
      if (!this.options.img.el) {
        this.options.img = { ...defaultImgOptions, ...this.options.img };
        this.options.img.rotate += angleCrds(
          this._map,
          this.options.prevLatlng,
          this._latlng
        );
        const img = document.createElement("img");
        img.src = this.options.img.url;
        this.options.img.el = img;
        img.onload = () => {
          this.redraw();
        };
        img.onerror = () => {
          this.options.img = null;
        };
      } else {
        this._renderer._updateImg(this);
      }
    },
  });

  L.canvasMarker = function (...opt) {
    try {
      const i = opt.findIndex((o) => typeof o === "object" && o.img);
      if (i + 1) {
        if (!opt[i].radius && opt[i].img && opt[i].img.size)
          opt[i].radius = Math.ceil(Math.max(...opt[i].img.size) / 2);
        if (opt[i].pane) delete opt[i].pane;
      }
    } catch (e) {}
    return new CanvasMarker(...opt);
  };
  // ----- leaflet-canvas-markers source code ends here -----

  const context = useLeafletContext();
  const {
    cluster,
    lat,
    lng,
    iconMode = "normal",
    radius = 20,
    size = [40, 40],
    rotate = 0,
    offsetX = 0,
    offsetY = 0,
    tooltipContent = "<span>Tooltip</span>",
    eventHandlers = {},
  } = props;

  useEffect(() => {
    const container = context.layerContainer || context.map;

    const canvasMarker = new L.canvasMarker(L.latLng(lat, lng), {
      radius: radius,
      img: {
        url:
          iconMode === "alert"
            ? "/icons/CameraRedBlur.png"
            : iconMode === "selected"
            ? "/icons/CameraPurple.png"
            : iconMode === "selectedWithAlert"
            ? "/icons/CameraPurpleBlur.png"
            : iconMode === "accessible"
            ? "/icons/CameraGreen.png"
            : "/icons/CameraGray.png",
        size: size,
        rotate: rotate,
        offset: { x: offsetX, y: offsetY },
      },
    });

    canvasMarker.bindTooltip(tooltipContent, {
      direction: "top",
      opacity: 1,
      className: "popup",
      interactive: true,
    });

    canvasMarker.on("click", eventHandlers.click);
    // container.addLayer(canvasMarker);
    cluster.addLayer(canvasMarker);

    return () => {
      //   container.removeLayer(canvasMarker);
      cluster.removeLayer(canvasMarker);
    };
  });

  return null;
};
export default CanvasMarker;
