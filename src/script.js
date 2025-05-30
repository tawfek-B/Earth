// Import Three.js and necessary components
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { Sun } from './Sun';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Scene setup
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);
camera.position.z = 30;
scene.add(camera);

// Add orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle window resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create and add Sun
const sun = new Sun();
const sunGroup = sun.getSun();
sunGroup.position.set(-50, 0, 30);
scene.add(sunGroup);

// Debug folder for ambient light
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.01);
ambientLightFolder.addColor(ambientLight, 'color');

// Debug folder for Sun
const sunFolder = gui.addFolder('Sun');
sunFolder.add(sunGroup.position, 'x').min(-100).max(100).step(1);
sunFolder.add(sunGroup.position, 'y').min(-100).max(100).step(1);
sunFolder.add(sunGroup.position, 'z').min(-100).max(100).step(1);

// Create Earth group
const earthGroup = new THREE.Group();
scene.add(earthGroup);

// Earth's axial tilt (23.5 degrees)
earthGroup.rotation.z = (23.5 / 360) * 2 * Math.PI;

// Debug folder for Earth group
const earthGroupFolder = gui.addFolder('Earth Group');
earthGroupFolder.add(earthGroup.rotation, 'z').min(0).max(Math.PI * 2).step(0.01).name('Axial Tilt');

// Load textures
const textureLoader = new THREE.TextureLoader();

// Create Earth with textures
const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('textures/Albedo.jpg'),
    bumpMap: textureLoader.load('textures/Bump.jpg'),
    bumpScale: 0.05,
    roughnessMap: textureLoader.load('textures/Albedo.jpg'),
    metalness: 0.1
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earth);

// Debug folder for Earth material
const earthMaterialFolder = gui.addFolder('Earth Material');
earthMaterialFolder.add(earthMaterial, 'metalness').min(0).max(1).step(0.01);
earthMaterialFolder.add(earthMaterial, 'roughness').min(0).max(1).step(0.01);
earthMaterialFolder.add(earthMaterial, 'bumpScale').min(0).max(0.2).step(0.001);

// Create clouds with texture
const cloudGeometry = new THREE.SphereGeometry(10.05, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/Clouds.png'),
    transparent: true,
    opacity: 0.4
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earthGroup.add(clouds);

// Debug folder for clouds
const cloudsFolder = gui.addFolder('Clouds');
cloudsFolder.add(cloudMaterial, 'opacity').min(0).max(1).step(0.01);
cloudsFolder.add(clouds, 'visible');

// Create atmosphere
const atmosphereGeometry = new THREE.SphereGeometry(10.1, 64, 64);
const atmosphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earthGroup.add(atmosphere);

// Debug folder for atmosphere
const atmosphereFolder = gui.addFolder('Atmosphere');
atmosphereFolder.add(atmosphereMaterial, 'opacity').min(0).max(1).step(0.01);
atmosphereFolder.addColor(atmosphereMaterial, 'color');
atmosphereFolder.add(atmosphere, 'visible');
atmosphereFolder.add(atmosphereGeometry.parameters, 'radius').min(10).max(15).step(0.1).onChange(() => {
    atmosphereGeometry.dispose();
    atmosphere.geometry = new THREE.SphereGeometry(
        atmosphereGeometry.parameters.radius,
        64,
        64
    );
});

// Add stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.1
});

const starsVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Debug folder for stars
const starsFolder = gui.addFolder('Stars');
starsFolder.add(starsMaterial, 'size').min(0.01).max(1).step(0.01);
starsFolder.addColor(starsMaterial, 'color');
starsFolder.add(stars, 'visible');

// Debug folder for camera
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z').min(10).max(100).step(1);
cameraFolder.add(controls, 'enableDamping');
cameraFolder.add(controls, 'dampingFactor').min(0.01).max(0.1).step(0.001);

// Debug folder for renderer
const rendererFolder = gui.addFolder('Renderer');
rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01);
rendererFolder.add(renderer, 'outputEncoding', {
    LinearEncoding: THREE.LinearEncoding,
    sRGBEncoding: THREE.sRGBEncoding
});

// Set initial rotation
earth.rotation.y = -0.3;
clouds.rotation.y = -0.3;

// Rotation speed control
let rotationSpeed = 0.001;
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        rotationSpeed += 0.0001;
    } else if (event.key === 'ArrowDown') {
        rotationSpeed = Math.max(0, rotationSpeed - 0.0001);
    }
    if(event.key ==='w') {
    }
});

// Animation loop
function renderLoop() {
    requestAnimationFrame(renderLoop);

    // Update controls
    controls.update();

    // Rotate Earth and clouds
    earth.rotation.y += rotationSpeed;
    clouds.rotation.y += rotationSpeed * 2;

    // Render scene
    renderer.render(scene, camera);
}

// Start animation
renderLoop(); 