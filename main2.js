import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class OuterSpaceSkybox {
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
    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(.1, .1, .1);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/SpiralGalaxy2.jpg',
    ]);
    this._scene.background = texture;
    
    const galaxyGeo = new THREE.PlaneGeometry( 25, 25 )
    const galaxyMat = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.01, side: THREE.DoubleSide} );
    const box = new THREE.Mesh( galaxyGeo, galaxyMat );
     box.rotation.set(this._camera.rotation.x,this._camera.rotation.y,this._camera.rotation.z);
     box.position.set(0, 0, -70);
     this._scene.add(box);

    // Add an event listener for mousemove.
     this._threejs.domElement.addEventListener('mousemove', (event) => {
     this._OnMouseMove(event, box);
     
    });
    /// listener section's end
    const animate = () => {
      requestAnimationFrame(animate);
      box.rotation.set(this._camera.rotation.x,this._camera.rotation.y,this._camera.rotation.z);
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
  _APP = new OuterSpaceSkybox(); 
});

