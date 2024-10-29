import { markerHide } from "./markerHide";
import { createLabels } from "../../components/threeObjects/labels";

let addMarkersFromData = function (data, allMarkersGRP,camera, geoForRayCast,controls) {
  console.log("add markers ",geoForRayCast)
    allMarkersGRP.clear();
    console.log(data)
    data.forEach(marker => {
      const label = createLabels(marker.color, marker.textContent, marker.link, marker.flash, marker.icon);
      label.position.set(marker.position.x, marker.position.y, marker.position.z);
      allMarkersGRP.add(label);
      label.updateMatrixWorld();
      markerHide(label, camera, geoForRayCast)
      controls.addEventListener('change', () => { markerHide(label, camera, geoForRayCast) });
    });
  }

  export {addMarkersFromData}