import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class Skybox {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(0, 0, 0);

    this._scene = new THREE.Scene();
    //Directional light settings to give the objects shadows
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);
    //Modified orbit controls to look around the center of the skybox
    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(.1, .1, .1);
    controls.update();
    //Sky box texturization
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/left_caves.png',
        './resources/right_caves.png',
        './resources/top_caves.png',
        './resources/bottom_caves.png',
        './resources/back_caves.png',
        './resources/front_caves.png',
        ]);
    this._scene.background = texture;

    //Creation of an object to serve as landmark for the exit in the skybox
    const cuevas = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    cuevas.position.set(-125, 7.5, -2.5);
    cuevas.castShadow = false;
    cuevas.receiveShadow = false;
    this._scene.add(cuevas);

    // Add an event listener for mousemove.
    this._threejs.domElement.addEventListener('mousemove', (event) => {
      this._OnMouseMove(event, cuevas);
      
     });
    /// listener section's end
    const animate = () => {
        requestAnimationFrame(animate);
        this._threejs.render(this._scene, this._camera);
    };

    // Call the animate function
    animate();
  
  }
  
  /// To show the textbox after the mouse hovers over the galaxy
  _OnMouseMove(event, box) {
    // Calculate the mouse position relative to the canvas
    const canvasRect = this._threejs.domElement.getBoundingClientRect(); /// Canvas bounds
    const mouseX = ((event.clientX - canvasRect.left) / this._threejs.domElement.clientWidth) * 2 - 1; ///Mouse relative position
    const mouseY = -((event.clientY - canvasRect.top) / this._threejs.domElement.clientHeight) * 2 + 1;

    // Create a ray from the mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, this._camera);

    // Check for intersection with the box (sphere)
    const intersects = raycaster.intersectObject(box);

    // Show/hide the text block based on the intersection
    const textBlock = document.getElementById('textBlock');
    if (intersects.length > 0) {
      textBlock.style.display = 'block';
    } 
  }
  /// Show object in window
  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Skybox(); 
});

