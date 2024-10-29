const setSize = function (container, camera, renderer,css2drenderer) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  css2drenderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
  constructor(container, camera, renderer,css2drenderer) {
    // set initial size
    setSize(container, camera, renderer,css2drenderer);

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer,css2drenderer);
      // perform any custom actions
    });
  }
}

export { Resizer };
