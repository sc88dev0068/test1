import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { Mesh, MeshBasicMaterial } from "three";

function joinGeometriesSimple(geo) {
    let geometries = [];
  
    geo.traverse(function (child) {
        if (child.isMesh) {
            let geo = child.geometry;

            if (geo.index) {
                geometries.push(geo.toNonIndexed());
            } else {
                geometries.push(geo.clone());
            }
        }
    })
    let mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    let material = new MeshBasicMaterial();
    let mesh = new Mesh(mergedGeometry, material)

    return mesh;

}

export { joinGeometriesSimple }