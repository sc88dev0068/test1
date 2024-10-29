import { CSS2DObject } from "three/examples/jsm/Addons.js";



const CreateMarkersData = function (id, position, textContent, color, flash, icon, link) {
  this.id = id;
  this.position = position;
  this.textContent = textContent;
  this.color = color;
  this.flash = flash;
  this.icon = icon;
  this.link = link;
}



let export3dmmfiles = function (allMarkersGRP,fileName) {

    const markersDataNew = [];
    allMarkersGRP.traverse((marker) => {
      if (marker instanceof CSS2DObject) {
        let path = marker.element.querySelector('path');
        let id = "test"

        markersDataNew.push(new CreateMarkersData(
          id,
          marker.position,
          marker.element.querySelector(".label").textContent,
          window.getComputedStyle(path).color,
          path.classList.contains("flash"),
          path.getAttribute('data-icon'),
          path.getAttribute('data-link')));
      }
    })

    const jsonString = JSON.stringify(markersDataNew, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName+".3dmm";
    link.click();
  }

  export {export3dmmfiles};