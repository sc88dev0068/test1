import { PerspectiveCamera } from "three";
import { Group } from "three";

function createCamera() {
  const camera = new PerspectiveCamera(
    30, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000 // far clipping plane);
  );

  camera.position.set(0, 100, 200);
  return camera;
}
export { createCamera };
