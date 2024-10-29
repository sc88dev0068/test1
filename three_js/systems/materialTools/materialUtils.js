function storeMaterialsinJsObj(jsObj, model) {
    
    model.traverse((el) => {
        if (el.isMesh) {

            jsObj[el.name] = el.material;
        }
    })

}

function applyMaterialSet(materialSet, model) {
    model.traverse((obj) => {
        if (obj.isMesh && materialSet[obj.name]) {
            obj.material = materialSet[obj.name];
        }
    })

}


export { storeMaterialsinJsObj,applyMaterialSet }