import { Raycaster } from "three/webgpu";
import { createLabels } from "../../components/threeObjects/labels";
import { markerHide } from "./markerHide";


let addMarkerOnDBLClick = function (container,allMarkersGRP,camera,geoForRayCast,controls,mouse) {
    let raycaster = new Raycaster();
    raycaster.firstHitOnly = true;

    container.addEventListener("dblclick", (event) => {
        if (raycaster) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(geoForRayCast);
            if (intersects.length > 0) {
                const label = createLabels();
                label.position.copy(intersects[0].point);
                console.log("new marker",label)
                
                allMarkersGRP.add(label);
                controls.addEventListener('change', () => { markerHide(label, camera, geoForRayCast) });
            }
        }
    })
}

export {addMarkerOnDBLClick};