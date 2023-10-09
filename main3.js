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
        './resources/left.png',
        './resources/right.png',
        './resources/top.png',
        './resources/bottom.png',
        './resources/back.png',
        './resources/front.png',
        ]);
    this._scene.background = texture;
    //Creation of objects to serve as landmarks for the locations in the skybox
    const aurora = new THREE.Mesh(
       new THREE.SphereGeometry(2, 32, 32),
       new THREE.MeshStandardMaterial({
           color: 0x00ff00,
           wireframe: true,
           wireframeLinewidth: 4,
       }));
     aurora.position.set(50, 50, 50);
     aurora.castShadow = false;
     aurora.receiveShadow = false;
     this._scene.add(aurora);

    const nube = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    nube.position.set(-50, 40, 25);
    nube.castShadow = false;
    nube.receiveShadow = false;
    this._scene.add(nube);

    const fosfo = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    fosfo.position.set(-49*2, -15, 50*2);
    fosfo.castShadow = false;
    fosfo.receiveShadow = false;
    this._scene.add(fosfo);

    const arbol = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    arbol.position.set(10, -50, 50);
    arbol.castShadow = false;
    arbol.receiveShadow = false;
    this._scene.add(arbol);


    const suelo = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    suelo.position.set(25*3, -10*3, 50*3);
    suelo.castShadow = false;
    suelo.receiveShadow = false;
    this._scene.add(suelo);

    const agua = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    agua.position.set(-70, -30, -50);
    agua.castShadow = false;
    agua.receiveShadow = false;
    this._scene.add(agua);


    const montana = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    montana.position.set(-130, -5, -50);
    montana.castShadow = false;
    montana.receiveShadow = false;
    this._scene.add(montana);


    const volcanes = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    volcanes.position.set(100, 70, -2);
    volcanes.castShadow = false;
    volcanes.receiveShadow = false;
    this._scene.add(volcanes);


    const cuevas = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          wireframe: true,
          wireframeLinewidth: 4,
      }));
    cuevas.position.set(125, 7.5, -2.5);
    cuevas.castShadow = false;
    cuevas.receiveShadow = false;
    this._scene.add(cuevas);

     // Add an event listener for mousemove for every object
      this._threejs.domElement.addEventListener('mousemove', (event1) => {
      this._OnMouseMove(event1, agua, 'textBlock', 'Agua');
      
     });
 
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, aurora, 'textBlock2', 'Auroras');
       
      });
 
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, fosfo, 'textBlock3', 'LucesTierra');     
       });
 
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, montana, 'textBlock4', 'Montana');
       });
 
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, nube, 'textBlock5', 'NubesSulfurada');     
           });
     
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, suelo, 'textBlock6', 'Suelo');
         });
     
     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, volcanes, 'textBlock7', 'Volcanes');
               }); 

     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, arbol, 'textBlock8', 'Arboles');
               }); 

     this._threejs.domElement.addEventListener('mousemove', (event1) => {
     this._OnMouseMove(event1, cuevas, 'textBlock9', 'Suelo');
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
  _OnMouseMove(event1, box, textBlock_id, Audio1_id) {
    // Calculate the mouse position relative to the canvas
    const canvasRect = this._threejs.domElement.getBoundingClientRect(); /// Bound del canvas
    const mouseX = ((event1.clientX - canvasRect.left) / this._threejs.domElement.clientWidth) * 2 - 1; ///position relativa del mouse respecto al canvas
    const mouseY = -((event1.clientY - canvasRect.top) / this._threejs.domElement.clientHeight) * 2 + 1;

    // Create a ray from the mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, this._camera);

    // Check for intersection with the box (sphere)
    const intersects = raycaster.intersectObject(box);

    // Show/hide the text block based on the intersection
    const textBlock = document.getElementById(textBlock_id);
    const Audio1 = document.getElementById(Audio1_id);
    if (intersects.length > 0) {
      if (textBlock_id == "textBlock9"){
        textBlock.style.display = 'block';
      }else{
        textBlock.style.display = 'block';
        Audio1.play();
      }
      
     } else {
      if (textBlock_id == "textBlock9"){
      }else{
        textBlock.style.display = 'none'; 
        Audio1.pause();
      }
      
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

