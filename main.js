import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class PlanetarySystem {
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
    
    //Camera inicialization information
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000.0;
    //Planet's Specific Orbit Properties (focal point, major and minor axis)
    const firstplanet_f = 52;  const firstplanet_majorAxis = firstplanet_f*3;  const firstplanet_minorAxis = firstplanet_f*1.5;
    const superearth_f = 82;  const superearth_majorAxis = superearth_f*3;  const superearth_minorAxis = superearth_f*1.5;
    const secondplanet_f = 120;  const secondplanet_majorAxis = secondplanet_f*3;  const secondplanet_minorAxis = secondplanet_f*1.5;
    const thirdplanet_f = 176;  const thirdplanet_majorAxis = thirdplanet_f*3;  const thirdplanet_minorAxis = thirdplanet_f*1.5;
    
    //Initial angle for every planet
    let firstplanet_theta = 0; 
    let superearth_theta = 0; 
    let secondplanet_theta = 0;
    let thirdplanet_theta = 0; 
    //Translational speed for every planet in the system
    const firstplanet_translationalSpeed = 0.0015;
    const superearth_translationalSpeed = 0.001;
    const secondplanet_translationalSpeed = 0.0006;
    const thirdplanet_translationalSpeed = 0.0004;
    //Camera setup
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(-90, 140, 140);     //Initial position

    this._scene = new THREE.Scene();
   
    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();
    //Creating a Star Skyblock Background 
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
        './resources/stars2.jpg',
    ]);
    this._scene.background = texture;
    
    //Creation of the star in the system, from which all the planets will orbit
    const textureLoader = new THREE.TextureLoader();
    //Here we're assigning the texture to a variable
    const sunMap = textureLoader.load('./resources/sun.jpg');
    sunMap.colorSpace = THREE.SRGBColorSpace;    //Then we're setting the textures's colorSpace to the SRGB Color space
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
        map: sunMap
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    this._scene.add(sun);     //Adding the star to the scene
   
    //This function will help us create all the planets in the system more efficiently
    const createPlanet = (size, texture, position, ring) => {
        //Doing the exact same thing to set the color the colorSpace of the planet's texture
        const map = textureLoader.load(texture);
        map.colorSpace = THREE.SRGBColorSpace;
        const geo = new THREE.SphereGeometry(size, 30, 30);
        const mat = new THREE.MeshBasicMaterial({
            map: map
        });
        const mesh = new THREE.Mesh(geo, mat);
        const obj = new THREE.Object3D();
        obj.add(mesh);
        //Adding the possibility to add rings to any planet in the system
        if(ring) {
        //Doing the exact same thing to set the color the colorSpace of the ring's texture
            const ringMap = textureLoader.load(ring.texture);
            ringMap.colorSpace = THREE.SRGBColorSpace;
            const ringGeo = new THREE.RingGeometry(
                ring.innerRadius,
                ring.outerRadius,
                32);
            const ringMat = new THREE.MeshBasicMaterial({
                map: ringMap,
                side: THREE.DoubleSide
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            obj.add(ringMesh);
            ringMesh.position.x = position;
            ringMesh.rotation.x = -0.5 * Math.PI;
        }
        this._scene.add(obj);
        mesh.position.x = position;   //Function returns relative to the star coordinates(mesh),
        return {mesh, obj}            //and absolute coordinates(obj) for each planet
    }
    //Creation of all the other planets in the system
    const firstplanet = createPlanet(5.8, './resources/firstplanet.jpg', firstplanet_f);
    const superearth = createPlanet(12, './resources/superearth.png', superearth_f);
    const secondplanet = createPlanet(15, './resources/secondplanet.png', secondplanet_f);
    const thirdplanet = createPlanet(10, './resources/thirdplanet.jpg', thirdplanet_f, {
        innerRadius: 10,
        outerRadius: 15,
        texture: './resources/ring.png'
    });
    //Creation of a marker that will redirect the user to the planet's surface
    const markergeo = new THREE.SphereGeometry(5.2, 10, 10);
    const markermat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF
    });
    const href_ball = new THREE.Mesh(markergeo, markermat);
    superearth.mesh.add(href_ball);     //The marker will follow the superearth's orbit, hiding inside it

    //Creation of a moon for the superearth following the same principle as the marker
    const moongeo = new THREE.SphereGeometry(1.2, 10, 10);
    const moonmap = textureLoader.load('./resources/moon.jpg');
    moonmap.colorSpace = THREE.SRGBColorSpace;
    const moonmat = new THREE.MeshBasicMaterial({
        map: moonmap
    });
    const moon = new THREE.Mesh(moongeo, moonmat);
    superearth.mesh.add(moon); //The moon will follow the superearth's orbit, hiding inside it
    moon.position.x = 24;     //The moon will be orbiting the superearth in a circular orbit

    // Add an event listener for mousemove.
    this._threejs.domElement.addEventListener('mousemove', (event) => {
      this._OnMouseMove(event, href_ball);
      
    });
     /// listener section's end

    //Adding a Light source to the scene
    const pointLight = new THREE.PointLight(0xFFFFFF, 30000, 300);
    this._scene.add(pointLight);
    
    //Animation function for rotational and translational motion.
    const animate = () => {
        requestAnimationFrame(animate);
        //Self Rotation using the relative coordinates
        sun.rotation.y -= 0.001;
        firstplanet.mesh.rotation.y += 0.002;
        superearth.mesh.rotation.y += 0.0095;
        secondplanet.mesh.rotation.y += 0.008;
        thirdplanet.mesh.rotation.y += 0.009;
        //Around the Sun Rotation
        //Function that creates the elliptic orbit with polar representation of the coordinates
        const PlanetCoordinates = (MajorAxis, MinorAxis, thet) => {
          const planet_x = MajorAxis * Math.cos(thet) * Math.cos(thet);
          const planet_y = MinorAxis * Math.sin(thet) * Math.cos(thet);
          return {planet_x, planet_y}   //Funtion returns the x and y coordinates for the planets elliptic orbit
        }
        //Planet's coordinate calculation
        const firstplanet_coordinates = PlanetCoordinates(firstplanet_majorAxis, firstplanet_minorAxis, firstplanet_theta);
        const superearth_coordinates = PlanetCoordinates(superearth_majorAxis, superearth_minorAxis, superearth_theta);
        const secondplanet_coordinates = PlanetCoordinates(secondplanet_majorAxis, secondplanet_minorAxis, secondplanet_theta);
        const thirdplanet_coordinates = PlanetCoordinates(thirdplanet_majorAxis, thirdplanet_minorAxis, thirdplanet_theta);
        
        //Assigning every planet it's position using the absolute coordinates for each one.
        firstplanet.obj.position.set( firstplanet_coordinates.planet_x-2*firstplanet_f,0 , firstplanet_coordinates.planet_y);
        superearth.obj.position.set(superearth_coordinates.planet_x-2*superearth_f, 0, superearth_coordinates.planet_y);
        secondplanet.obj.position.set(secondplanet_coordinates.planet_x-2*secondplanet_f, 0, secondplanet_coordinates.planet_y);
        thirdplanet.obj.position.set(thirdplanet_coordinates.planet_x-2*thirdplanet_f, 0, thirdplanet_coordinates.planet_y);
        //Calculating the next value of theta for every planet
        firstplanet_theta += firstplanet_translationalSpeed;
        superearth_theta += superearth_translationalSpeed;
        secondplanet_theta += secondplanet_translationalSpeed;
        thirdplanet_theta += thirdplanet_translationalSpeed;

        this._threejs.render(this._scene, this._camera);
    };

    // Call the animate function
    animate();
  }

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

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new PlanetarySystem();
});
