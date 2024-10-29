
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createCameraControls } from "./systems/cameraControls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { gltfLoad } from "./components/gltfLoader/gltfLoad.js";
import { hdriLoad } from "./components/hdriLoader/hdriLoader.js";
import { BufferGeometry, Mesh, Raycaster, Vector2 } from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { normalWorld, normalView, timerLocal, mx_noise_vec3, MeshStandardNodeMaterial, Color, userData, MeshPhysicalNodeMaterial, MeshPhysicalMaterial, color, TextureLoader, BoxGeometry, float, Fn, mix, Vector3, DataTexture, RGBAFormat, FloatType, uv, distance, vec2, vec3, positionGeometry, remapClamp } from 'three/tsl';
import { BufferGeometryUtils, ConvexHull, CSS2DObject, CSS2DRenderer } from "three/examples/jsm/Addons.js";
import { createHelpers } from "./components/helpers.js";
import { createLabels } from "./components/threeObjects/labels.js";
import { Group } from 'three';

import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVHHelper } from 'three-mesh-bvh';
import { joinGeometriesSimple } from './systems/geomertyTools/joinGeometriesSimple.js';

import { Pane } from "tweakpane";
import { applyMaterialSet, storeMaterialsinJsObj } from './systems/materialTools/materialUtils.js';
import tippy from 'tippy.js';
import { markersData } from './components/defaultData/markersData.js';
import { iconsData } from './components/defaultData/iconsData.js';
import { createInputHTMLElement } from "./components/htmlElements/inputElement.js";
import { export3dmmfiles } from "./systems/export3dmmFiles/export3dmmfiles.js";
import { createContextMenu } from "./systems/ui/contextMenu.js";
import { markerHide } from "./systems/markerTools/markerHide.js";
import { addMarkersFromData } from "./systems/markerTools/addMarkersFromData.js";
import { addMarkerOnDBLClick } from "./systems/markerTools/addMarkerOnDBLClick.js";
import { PostProcessing } from "three/webgpu";
import { pass, depthPass } from "three/tsl";
import { sobel } from "three/webgpu";
import { remap } from "three/webgpu";
import { normalize } from "three/src/math/MathUtils.js";
import { MouseTracker } from "./systems/mouse/MouseTracker.js";
import { texture } from "three/webgpu";
import { bool } from "three/webgpu";


// import { anamorphic } from 'three/addons/tsl/display/AnamorphicNode.js';


//ADD THREE MESH BVH TO THE GEOMETRY
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;



let camera;
let renderer;
let scene;
let controls;
let stats;
let css2drenderer;
let helpers;

let raycaster;
let pointer;
let gltfModel;

let raycaster2;
let allMarkersGRP;
let tweakpaneGui;
let geoForRayCast=[1,2,3];
let postProcessing;

let mouseTracker;


class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    helpers = createHelpers();
    this.container = container;
    allMarkersGRP = new Group();
    css2drenderer = new CSS2DRenderer();
    css2drenderer.domElement.style.position = 'absolute';
    css2drenderer.domElement.style.top = '0px';
    css2drenderer.domElement.style.pointerEvents = 'none';

    mouseTracker = new MouseTracker();

    tweakpaneGui = new Pane();

    stats = new Stats();
    document.body.appendChild(stats.dom);

    //WINDOW RESIZER
    const resizer = new Resizer(container, camera, renderer, css2drenderer);
    container.append(renderer.domElement);
    container.append(css2drenderer.domElement);

    controls = createCameraControls(camera, renderer.domElement);

  }

  //SETS UP BACKGROUND
  async loadBackground() {
    const { background1, hdri1 } = await hdriLoad();
    scene.background = background1;
    scene.environment = hdri1;
  }

  //GLTF LOADER
  async loadGltf() {
    const { loadedmodel } = await gltfLoad();

    gltfModel = loadedmodel;
    scene.add(gltfModel);

    gltfModel.traverse((child) => {
      if (child.name.split("_")[0] === "Point") {
        console.log(child.position);

      }

    })


    const randomPoints = [
      new Vector3(-76.02596282958984, 6.908859729766846, -0.4334923028945923),
      new Vector3(-76.02596282958984, 6.908859729766846, -1.9960052967071533),
      new Vector3(-76.02596282958984, 6.908859729766846, -3.5350284576416016),
      new Vector3(-76.02596282958984, 6.908859729766846, -5.055258274078369),
      new Vector3(-75.07412719726562, 6.908859729766846, -0.4334923028945923),
      new Vector3(-75.07412719726562, 6.908859729766846, -1.9960052967071533),
      new Vector3(-75.07412719726562, 6.908859729766846, -3.5350284576416016),
      new Vector3(-75.07412719726562, 6.908859729766846, -5.055258274078369),
      new Vector3(-74.1222915649414, 6.908859729766846, -0.4334923028945923),
      new Vector3(-74.1222915649414, 6.908859729766846, -1.9960052967071533),
      new Vector3(-74.1222915649414, 6.908859729766846, -3.5350284576416016),
      new Vector3(-74.1222915649414, 6.908859729766846, -5.055258274078369),
      new Vector3(-73.17045593261719, 6.908859729766846, -0.4334923028945923),
      new Vector3(-73.17045593261719, 6.908859729766846, -1.9960052967071533),
      new Vector3(-73.17045593261719, 6.908859729766846, -3.5350284576416016),
      new Vector3(-73.17045593261719, 6.908859729766846, -5.055258274078369)
    ];

    const randomPointsColors = [
      new Color(0.829, 0, 0.171), // Corresponds to first vector
      new Color(0.729, 0, 0.271),
      new Color(0.629, 0, 0.371),
      new Color(0.529, 0, 0.471),
      new Color(0.429, 0, 0.571),
      new Color(0.329, 0, 0.671),
      new Color(0.229, 0, 0.771),
      new Color(0.129, 0, 0.871),
      new Color(0.029, 0, 0.971), 
      new Color(0.171, 0, 0.829),
      new Color(0.271, 0, 0.729),
      new Color(0.371, 0, 0.629),
      new Color(0.471, 0, 0.529),
      new Color(0.571, 0, 0.429),
      new Color(0.671, 0, 0.329),
      new Color(0.771, 0, 0.229) // Corresponds to the last vector
    ];
    

    //Compute bounds tree for raycasting

    const newMaterials = {
      newMat: new MeshPhysicalNodeMaterial(),
      newTranparentMat: new MeshPhysicalNodeMaterial()
    }


    gltfModel.traverse((child) => {

      if (child.isMesh) {
        child.geometry.computeBoundsTree();



        child.userData.map = child.material.map;
        child.userData.color = child.material.color;

        child.userData.textureOverlay = true;

        child.userData.metalness = child.material.metalness;
        child.userData.roughness = child.material.roughness;

        child.userData.metalnessMap = child.material.metalnessMap;
        child.userData.roughnessMap = child.material.roughnessMap;
        // child.userData.side = child.material.side;
        child.userData.normalMap = child.material.normalMap;
        // child.userData.alphaMap = child.material.alphaMap;

        child.userData.colorOverlay = new Color(0xffffff);

        child.userData.nColor = new Color(0xffffff);
        child.userData.transparent = child.material.transparent;

        child.userData.heatMapOverlay  = false;



        // console.log(typeof (child.userData.side))

        if (child.material.transparent) {
          child.material = newMaterials.newTranparentMat;
        } else {
          child.material = newMaterials.newMat;
        }
      }
    })


    let textureOverlayToggle = Fn(() => {
      return mix(color(new Color(0xffffff)), userData("map", "texture"), userData("textureOverlay", "float"));
    })


    Object.values(newMaterials).forEach(material => {
      material.colorNode = textureOverlayToggle().mul(userData("color", "color")).mul(userData("nColor", "color")).mul(userData("colorOverlay", "color"))
      material.metalnessNode = userData("metalness", "float");
      material.roughnessNode = userData("roughness", "float");
      material.side = 2;

    })

    newMaterials.newTranparentMat.transparent = true;


    let colorOverlay = new Color(0xbbbbbb);
    let noColorOverlay = new Color(0xffffff);

    const raycasterForSections = new Raycaster();
    raycasterForSections.firstHitOnly = true;

    let lastIntersected = null; // To track the previously intersected object

    const setObjectColor = (object, color) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.userData.colorOverlay.copy(color);
        }
      });
    };


    const onPointerMove = function (event) {

      raycasterForSections.setFromCamera(mouseTracker.mouse, camera);

      const intersects = raycasterForSections.intersectObjects(gltfModel.children, true);

      if (intersects.length > 0) {
        let intersectObject = intersects[0].object;

        // Check if the intersected object is a "Section"
        if (intersectObject.name.split("_")[0] === "Section") {
          // If it's a new intersected object
          if (lastIntersected !== intersectObject) {
            if (lastIntersected) setObjectColor(lastIntersected, noColorOverlay); // Reset previous intersected object's color
            setObjectColor(intersectObject, colorOverlay); // Set the color overlay on the new intersected object
            lastIntersected = intersectObject;
          }
        } else {
          let parentObject = intersectObject.parent;
          if (lastIntersected !== parentObject) {
            if (lastIntersected) setObjectColor(lastIntersected, noColorOverlay); // Reset previous intersected object's color
            setObjectColor(intersectObject, colorOverlay); // Set the color overlay on the parent object
            lastIntersected = parentObject;
          }
        }
      } else {
        // Reset color if nothing is intersected
        if (lastIntersected) {
          setObjectColor(lastIntersected, noColorOverlay);
          lastIntersected = null; // Clear the reference
        }
      }
    };

    const selectedSectionParams = {
      color: "rgb(255,0,0)",
      selectedSection: "none",
      textureOverlay: true,
      heatMapOverlay:false
    }


    let selectedObj;
    const onClick = function () {
      if (lastIntersected) {
        selectedObj = lastIntersected;

        selectedObj.traverse((child) => {
          if (child.isMesh) {
            selectedSectionParams.color = child.userData.nColor.getStyle();
            selectedSectionParams.selectedSection = selectedObj.name;
            selectedSectionParams.textureOverlay = child.userData.textureOverlay;
            tweakpaneGui.refresh()
          }
        })
      }
    }

    this.container.addEventListener('pointermove', onPointerMove);
    this.container.addEventListener('click', onClick);


    ///////////////
    //HeatMap test
    let deck = gltfModel.getObjectByName("Section_deck0009");
    let heatMapMat = new MeshStandardNodeMaterial();
    // deck.material = heatMapMat;

    //Data 
    const count = randomPoints.length;
    const itemSize = 4;
    const randomPointsData = new Float32Array(count * itemSize)

    for (let i = 0; i < count; i++) {

      const stride = i * itemSize;

      randomPointsData[stride] = randomPoints[i].x;
      randomPointsData[stride + 1] = randomPoints[i].y;
      randomPointsData[stride + 2] = randomPoints[i].z;
      randomPointsData[stride + 3] = 1;

    }

    //Data Texture
    const width = count;
    const height = 1;
    const dataTexture = new DataTexture(randomPointsData, width, height, RGBAFormat, FloatType);
    dataTexture.needsUpdate = true;

    heatMapMat.colorNode = texture(dataTexture);


    const pointsVisualize = Fn(() => {

      let finalColor = vec3(0.0);
      let aColor = new Color();
      let bColor = color(1, 1, 1);

      for (let i = 0; i < count; i++) {

        let randomPos = texture(dataTexture, vec2(i/count,0.0))
        let distance1 = distance(positionGeometry,randomPos);

        distance1 = remapClamp(distance1,0,2,0,1)

        aColor = randomPointsColors[i]
      

        finalColor =  mix(aColor,bColor,distance1);

        bColor = finalColor;

      }
      return finalColor
    })


    heatMapMat.colorNode = pointsVisualize();



    ///////////////

    this.createShipUI();
    this.createExportUI();
    this.createImportUI();
    this.createHelpersUI();

    const selectedSection = tweakpaneGui.addFolder({
      title: "Selected-Section"
    })


    selectedSection.addBinding(selectedSectionParams, "selectedSection", {
      readonly: true,
    });


    selectedSection.addBinding(selectedSectionParams, "color").on('change', (ev) => {
      if (selectedObj) {
        selectedObj.traverse((child) => {
          if (child.isMesh) {
            child.userData.nColor.set(ev.value)

          }
        })
      }
    });

    selectedSection.addBinding(selectedSectionParams, "textureOverlay").on("change", (ev) => {
      if (selectedObj) {
        selectedObj.traverse((child) => {
          if (child.isMesh) {
            child.userData.textureOverlay = ev.value;

          }
        })
      }
    })

    selectedSection.addBinding(selectedSectionParams, "heatMapOverlay").on("change", (ev) => {
      if (selectedObj) {
        selectedObj.traverse((child) => {
          if (child.isMesh) {
            
            if (ev.value == true) {
              child.material = heatMapMat;
            } else if(ev.value == false){
              child.material = newMaterials.newMat;
            }

          }
        })
      }
    })



    console.log("here",)
    console.log(allMarkersGRP,"default")
    addMarkerOnDBLClick(this.container, allMarkersGRP, camera, gltfModel.children, controls, mouseTracker.mouse);
    addMarkersFromData(markersData, allMarkersGRP, camera, gltfModel.children, controls);
    createContextMenu(this.container, allMarkersGRP, camera, gltfModel.children);

  }

  createShipUI() {
    let gltfDefaultMaterials = {};
    storeMaterialsinJsObj(gltfDefaultMaterials, gltfModel);
    let material = new MeshStandardNodeMaterial();
    material.colorNode = normalWorld.mul(1);

    const offsetNode = timerLocal();
    const customUV = normalWorld.mul(3).add(offsetNode);

    //GUI using TWEAKPANE

    const PARAMS = {
      ShipTexture: 0,
      GridVisible: true,
      MarkersVisible: true,
    };

    const textureOptions = {
      DefaultTextures: 0,
      NormalWorld: normalWorld.mul(1),
      NormalView: normalView.mul(1),
      Noise: mx_noise_vec3(normalWorld.mul(1)),
      NoiseAnimated: mx_noise_vec3(customUV)
    }

    //SHIP UI///////////////////////////////////////////////
    const Ship = tweakpaneGui.addFolder({
      title: "SHIP"
    });

    Ship.addBinding(PARAMS, "ShipTexture", {
      options: textureOptions,

    }).on('change', (ev) => {
      if (ev.value == 0) {
        applyMaterialSet(gltfDefaultMaterials, gltfModel)
      } else {
        gltfModel.traverse((obj) => {
          if (obj.isMesh) obj.material = material;
        });

        material.colorNode = ev.value;
        material.needsUpdate = true;
      }
    })

  }

  createExportUI() {

    //FILE EXPORT GUI
    const fileParams = {
      exportFileName: 'markers-data',
      selectMarkerFile: "default",
    };


    const exportFolder = tweakpaneGui.addFolder({ title: `FILE-EXPORT` });

    exportFolder.addBinding(fileParams, "exportFileName", {
      label: "Export File Name"
    });

    exportFolder.addButton({
      title: 'Export Markers',
    }).on("click", (ev) => {

      export3dmmfiles(allMarkersGRP, fileParams.exportFileName);
    })

  }

  createImportUI() {

    //FILE-IMPORT GUI

    const importedMarkersParams = {
      default: "default"
    }

    const importedMarkersData = {
      default: markersData,
    }

    const importFolder = tweakpaneGui.addFolder({ title: `FILE-IMPORT` });

    const fileInputDiv = createInputHTMLElement();
    const fileInput1 = fileInputDiv.children[0];

    let newMarkersData;
    let importButton;
    let selectMakersDataUI;


    const fileParams = {
      exportFileName: 'markers-data',
      selectMarkerFile: "default",
    };


    const load3dmmfiles = async function () {
      console.log("here load three mm files")
      const files = fileInput1.files

      await Promise.all(
        Object.entries(files).map(async ([key, file]) => {
          const data = await file.text();
          console.log(data)
          const newMarkersData = JSON.parse(data);
          console.log(newMarkersData)
          const fileName = file.name.split('.').slice(0, -1).join('.');

          importedMarkersParams[fileName] = fileName;
          importedMarkersData[fileName] = newMarkersData;
        })
      );

      selectMakersDataUI.dispose();

      selectMakersDataUI = importFolder.addBinding(fileParams, "selectMarkerFile", {
        label: "Select Markers Data",
        options: importedMarkersParams
      }).on("change", (ev) => {
        console.log("ev",ev,ev.value)
        console.log(importedMarkersData)
        addMarkersFromData(importedMarkersData[ev.value], allMarkersGRP, camera, gltfModel.children, controls);
      })

      // tweakpaneGui.refresh();

    }

    fileInputDiv.addEventListener("change", load3dmmfiles);

    importButton = importFolder.addButton({
      title: 'Import Markers',

    }).on("click", (ev) => {
      fileInput1.click();

    })

    selectMakersDataUI = importFolder.addBinding(fileParams, "selectMarkerFile", {
      label: "Select Markers Data",
      options: importedMarkersParams
    })

  }



  createHelpersUI() {
    //SCENE-HELPERS UI
    const SceneHelpersPARAMS = {
      GridVisible: true,
      MarkersVisible: true,
    };

    const SceneHelpers = tweakpaneGui.addFolder({
      title: "SCENE-HELPERS"
    });

    SceneHelpers.addBinding(SceneHelpersPARAMS, "GridVisible", { label: "Grid" }).on("change", (ev) => {
      helpers.visible = !helpers.visible;
    })
    SceneHelpers.addBinding(SceneHelpersPARAMS, "MarkersVisible", { label: "Markers" }).on("change", (ev) => {
      allMarkersGRP.visible = !allMarkersGRP.visible;
    })

  }

  //START RENDERING
  start() {
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera)
      css2drenderer.render(scene, camera);
      controls.update();
      stats.update();
      // console.log(renderer.info.render.drawCalls);
    });
    // renderer.render(scene, camera);
    // css2drenderer.render(scene, camera);
    scene.add(helpers);
    scene.add(allMarkersGRP);
  }
}

export { World };
