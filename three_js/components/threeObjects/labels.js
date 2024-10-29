import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { iconsData } from "../defaultData/iconsData";


function createLabels(color, textContent, link, flash, icon) {

    const parent = document.createElement('div');
    parent.className = "parentDiv";

    //create HTML element
    const hotspot = document.createElement('div');
    hotspot.className = 'hotspot';
    if (color) {
        hotspot.style.backgroundColor = color;
    }

    // console.log(hotspot);

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "20");
    svgElement.setAttribute("height", "20");
    svgElement.setAttribute("fill", "currentColor");
    svgElement.setAttribute("viewBox", "0 0 16 16");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (icon) {
        pathElement.setAttribute("data-icon", icon);
        pathElement.setAttribute("d", iconsData[icon]);
    } else {
        pathElement.setAttribute("data-icon", "circle");
        pathElement.setAttribute("d", iconsData["circle"]);

    }

    if (link) {
        pathElement.setAttribute("data-link", link);
    }

    pathElement.style.pointerEvents = 'auto';

    // console.log(color);
    if (color) {
        pathElement.style.backgroundColor = color;
    } else {
        pathElement.style.color = "#ffffff";
    }

    pathElement.style.color = color;

    if (flash) {
        pathElement.classList.add("flash")
    } else { pathElement.classList.remove("flash") };

    svgElement.appendChild(pathElement);


    const label = document.createElement('div');
    label.className = 'label';
    // console.log(textContent);
    if (textContent) {
        label.textContent = textContent;
    } else {
        label.textContent = 'LABEL';
    }

    label.style.pointerEvents = 'auto';
    label.contentEditable = true;
    label.focus();


    // parent.append(hotspot);
    parent.append(svgElement);
    parent.append(label);



    pathElement.addEventListener('click', (ev) => {

        if (pathElement.dataset.link !== undefined) {
            if (confirm(`Do you want to open ${pathElement.dataset.link}`)) {
                window.open(pathElement.dataset.link);
            }
        }

    })





    //create CSS2D object
    const css2Dobj = new CSS2DObject(parent)
    pathElement.setAttribute("data-css2DobjId", css2Dobj.id);
    return css2Dobj;
}

export { createLabels };