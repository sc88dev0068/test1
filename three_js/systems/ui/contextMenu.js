import { Pane } from "tweakpane";
import { iconsData } from "../../components/defaultData/iconsData";
import tippy from "tippy.js";
import { markerHide } from "../markerTools/markerHide";



let createContextMenu = function (container,allMarkersGRP,camera, geoForRayCast) {
console.log("all markers", allMarkersGRP)

    const contextMenuContainer = document.createElement("div");
    contextMenuContainer.style.width = "fit-content";
    contextMenuContainer.id = "parent";


    const tempMarkerParams = {
        color: 'rgb(255, 255, 255)',
        icon: "circle",
        flash: false,
        link: "https://cognitivendt02.xaaslabs.com/folder/BallastTank-37e266b6-a300-48b2-a774-2c2d6d517a6b",
        position: { x: 0, y: 0, z: 0 }
    };

    const icons = {}

    for (const [key, value] of Object.entries(iconsData)) {
        icons[key] = key;
    }

    const contextMenu = new Pane({
        container: contextMenuContainer,
    });

    contextMenu.addBinding(tempMarkerParams, 'color').on("change", (ev) => {
        selectedElement.style.color = ev.value;
    });

    contextMenu.addBinding(tempMarkerParams, 'flash').on("change", (ev) => {
        if (ev.value === true) {
            selectedElement.classList.add("flash")
        } else { selectedElement.classList.remove("flash") }
    });

    contextMenu.addBinding(tempMarkerParams, 'icon', {
        options: icons
    }).on("change", (ev) => {
        selectedElement.setAttribute('d', iconsData[ev.value])
        selectedElement.dataset.icon = ev.value;
    });

    contextMenu.addBinding(tempMarkerParams, 'link').on("change", (ev) => {
        selectedElement.dataset.link = ev.value;
        console.log(selectedElement.dataset.link);
    })

    contextMenu.addBinding(tempMarkerParams, 'position').on("change", (ev) => {
        selectedCSS2DObj.position.set(ev.value.x, ev.value.y, ev.value.z);
        markerHide(selectedCSS2DObj,camera,geoForRayCast);
    })

    contextMenu.addButton({
        title: 'Delete Marker',
    }).on("click", (ev) => {
        instance.hide();
        allMarkersGRP.remove(selectedCSS2DObj);

    })


    let selectedElement = null;
    let selectedCSS2DObj = null;

    //TIPPY HANDLES CONTEXT MENU PLACEMENT
    const instance = tippy(container, {
        content: contextMenuContainer,
        placement: 'right-start',
        trigger: 'manual',
        interactive: true,
        arrow: false,
        offset: [0, 0],
        delay: [0, 0],
        duration: [0, 0]

    });

    container.addEventListener('contextmenu', (event) => {
        if (event.target instanceof SVGPathElement) {
            event.preventDefault();
            selectedElement = event.target;
            selectedCSS2DObj = allMarkersGRP.getObjectById(parseInt(selectedElement.getAttribute("data-css2DobjId")));

            instance.setProps({
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });

            tempMarkerParams.color = getComputedStyle(selectedElement).getPropertyValue("color");
            tempMarkerParams.flash = selectedElement.classList.contains("flash");
            tempMarkerParams.icon = selectedElement.dataset.icon;
            tempMarkerParams.link = selectedElement.dataset.link;

            tempMarkerParams.position.x = selectedCSS2DObj.position.x;
            tempMarkerParams.position.y = selectedCSS2DObj.position.y;
            tempMarkerParams.position.z = selectedCSS2DObj.position.z;

            contextMenu.refresh();

         
            instance.show();
        }
    });

}


export {createContextMenu};