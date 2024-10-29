import { AxesHelper, GridHelper, Group } from "three/webgpu";


function createHelpers(){
    const helperGroup = new Group;
    const axesHelper = new AxesHelper(50);
    const gridHelper = new GridHelper(100,10);

    helperGroup.add(axesHelper,gridHelper)

    return helperGroup;
}

export {createHelpers};