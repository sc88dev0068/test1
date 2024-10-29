import { Vector2 } from "three/webgpu";


class MouseTracker {
    constructor() {
        this.mouse = new Vector2();
        this.onMouseMove = this.onMouseMove.bind(this);

        // Add the event listener when an instance of this class is created
        document.addEventListener("pointermove", this.onMouseMove);
    }

    onMouseMove(event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    destroy() {
        document.removeEventListener("mousemove", this.onMouseMove);
    }

}

export { MouseTracker }