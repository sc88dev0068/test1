import { Sprite, SpriteMaterial, TextureLoader } from "three";


function createSprite(){
    const map = new TextureLoader().load("/textures/Simpleicons_Interface_lightbulb-of-spherical-shape.svg")
    const material = new SpriteMaterial({color: 0xffffaa,map: map,sizeAttenuation: false});
    // material1.sizeAttenuation = false;
    const sprite = new Sprite(material);

    return sprite;
}

export {createSprite}