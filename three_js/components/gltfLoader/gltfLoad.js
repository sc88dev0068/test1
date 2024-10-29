import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { setupModel } from "./setupModel.js";

import { LoadingManager } from "three";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { Vector3 } from "three/webgpu";

async function gltfLoad() {
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/decoder/');
  loader.setDRACOLoader(dracoLoader);

  const modelData = await loader.loadAsync("/models/Burke-Class-DDG-52-USS-Barry-v05_optimized.glb");

  const loadedmodel = setupModel(modelData);

  // let vector3 = new Vector3()

  // loadedmodel.getObjectByName("Point_001").getWorldPosition(vector3)

  // console.log(vector3,loadedmodel.getObjectByName("Point_001").position)

  return { loadedmodel };
}

export { gltfLoad };
