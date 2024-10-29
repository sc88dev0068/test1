import { Raycaster, Vector3 } from "three/webgpu";

let raycaster = new Raycaster();
raycaster.firstHitOnly = true;

let markerHide = function (label, camera, geoForRayCast) {
    console.log("hide markers",geoForRayCast)
    let labelPos = new Vector3();
    let v1 = new Vector3();
    labelPos = v1.setFromMatrixPosition(label.matrixWorld);
    const screenPos = labelPos.clone();
    screenPos.project(camera)


    if (screenPos.x >= -1.1 && screenPos.x <= 1.1 && screenPos.y >= -1.1 && screenPos.y <= 1.1) {
        raycaster.setFromCamera(screenPos, camera)
        const intersects2 = raycaster.intersectObjects(geoForRayCast, true)

        if (intersects2.length) {
            const intersectionDistance = intersects2[0].distance
            const pointDistance = labelPos.distanceTo(raycaster.ray.origin)

            let difference = pointDistance - intersectionDistance;

            if (difference < 0.0001) {
                label.element.style.visibility = "visible";

            } else if (difference > 0.0001) {
                label.element.style.visibility = "hidden";

            }

        }
    }
};

export { markerHide };