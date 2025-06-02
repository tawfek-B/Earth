// Import Three.js and necessary components
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { Sun } from './Sun';
import { Planets } from './Planets'

const planets = new Planets();


// Constants
const CONSTANTS = {
    MOUSE_SENSITIVITY: 0.002,
    MOVE_SPEED: 0.5,
    EARTH_ORBIT_RADIUS: 5000,
    MOON_ORBIT_RADIUS: 12.8,
    ISS_ORBIT_RADIUS: 4,
    CAMERA_DISTANCES: {
        Sun: 100,
        ISS: 10,
        Moon: 20,
        Mercury: 15  // Added Mercury with appropriate camera distance
    },
    ORBITAL_PERIODS: {
        EARTH: 365.25 * 24 * 3600 * 1000,
        MOON: 27.32 * 24 * 3600 * 1000,
        EARTH_ROTATION: 23.93 * 3600
    }
};

// Constants for scaling and timing
const SCALE_FACTORS = {
    AU_TO_UNITS: 5000, // 1 AU = 5000 units
    EARTH_ORBIT_RADIUS: 5000, // Earth's orbit radius in our units
    MOON_ORBIT_RADIUS: 38.44, // Moon's orbit radius in our units
    ISS_ORBIT_RADIUS: 6.771 // ISS orbit radius in our units
};

// Orbital periods in seconds
const ORBITAL_PERIODS = {
    MERCURY: 7600320,     // 88 days
    VENUS: 19414080,      // 224.7 days
    EARTH: 31557600,      // 365.25 days
    MARS: 59356800,       // 687 days
    JUPITER: 374335200,   // 11.86 years
    SATURN: 929577600,    // 29.46 years
    URANUS: 2651371200,   // 84.01 years
    NEPTUNE: 5200416000,  // 164.79 years
    PLUTO: 7819488000,    // 248.09 years
    MOON: 2360448         // 27.32 days
};

// Rotation periods in seconds
const ROTATION_PERIODS = {
    MERCURY: 5067360,    // 58.65 Earth days
    VENUS: 20995200,     // 243 Earth days (retrograde)
    EARTH: 86148,        // 23.93 hours
    MARS: 88620,         // 24.62 hours
    JUPITER: 35730,      // 9.93 hours
    SATURN: 38340,       // 10.66 hours
    URANUS: 62064,       // 17.24 hours
    NEPTUNE: 57960,      // 16.11 hours
    PLUTO: 551880        // 6.39 Earth days
};

// Base orbital speeds in radians per second
const ORBITAL_SPEEDS = {
    MERCURY: 2 * Math.PI / 7600320,    // 88 days
    VENUS: 2 * Math.PI / 19414080,     // 224.7 days
    EARTH: 2 * Math.PI / 31557600,     // 365.25 days
    MARS: 2 * Math.PI / 59356800,      // 687 days
    JUPITER: 2 * Math.PI / 374335200,  // 11.86 years
    SATURN: 2 * Math.PI / 929577600,   // 29.46 years
    URANUS: 2 * Math.PI / 2651371200,  // 84.01 years
    NEPTUNE: 2 * Math.PI / 5200416000, // 164.79 years
    PLUTO: 2 * Math.PI / 7819488000    // 248.09 years
};

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

scene.add(planets.getPlanets());

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 15000);
camera.position.z = 30;
scene.add(camera);

// Movement state
const movementState = {
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    keys: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
    }
};

// Event listeners
const setupEventListeners = () => {
    // Mouse controls
    canvas.addEventListener('mousedown', (event) => {
        movementState.isDragging = true;
        movementState.previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!movementState.isDragging) return;
        const deltaMove = {
            x: event.clientX - movementState.previousMousePosition.x,
            y: event.clientY - movementState.previousMousePosition.y
        };
        camera.rotation.y -= deltaMove.x * CONSTANTS.MOUSE_SENSITIVITY;
        camera.rotation.x -= deltaMove.y * CONSTANTS.MOUSE_SENSITIVITY;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        movementState.previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    canvas.addEventListener('mouseup', () => movementState.isDragging = false);
    canvas.addEventListener('mouseleave', () => movementState.isDragging = false);

    // Keyboard controls
    const keyMap = {
        'KeyW': 'forward',
        'KeyS': 'backward',
        'KeyA': 'left',
        'KeyD': 'right',
        'KeySpace': 'up',
        'KeyC': 'down'
    };

    document.addEventListener('keydown', (event) => {
        if (keyMap[event.code]) movementState.keys[keyMap[event.code]] = true;
    });

    document.addEventListener('keyup', (event) => {
        if (keyMap[event.code]) movementState.keys[keyMap[event.code]] = false;
    });

    // Window resize
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Fullscreen
    window.addEventListener('dblclick', () => {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        if (!fullscreenElement) {
            canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
    });
};

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


// Debug folder for ambient light
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.01);
ambientLightFolder.addColor(ambientLight, 'color');


// Create Earth group
const earthGroup = new THREE.Group();
scene.add(earthGroup);

// Set initial Earth position
earthGroup.position.set(SCALE_FACTORS.EARTH_ORBIT_RADIUS, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;



// Create and add Sun
const sun = new Sun();
const sunGroup = sun.getSun();
sunGroup.position.set(0, 0, 0);
scene.add(sunGroup);

// Debug folder for Sun
const sunFolder = gui.addFolder('Sun');
sunFolder.add(sun.sunLight, 'intensity', 0, 10, 0.01);
sunFolder.add(sun.sunLight, 'decay', 0, 10, 0.01);
sunFolder.add(sun.sunLight, 'distance', 0, 1000, 1);

// Earth's axial tilt (23.5 degrees)
earthGroup.rotation.z = (23.5 / 360) * Math.PI * 2;

// Debug folder for Earth group
const earthGroupFolder = gui.addFolder('Earth Group');
earthGroupFolder.add(earthGroup.rotation, 'z').min(0).max(Math.PI * 2).step(0.01).name('Axial Tilt');

// Load textures
const textureLoader = new THREE.TextureLoader();

// Create Earth with textures
const earthGeometry = new THREE.SphereGeometry(6.371, 64, 64); // Earth radius in thousands of km
const earthMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/Earth/Albedo.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = true;
        texture.anisotropy = 16;
    }),
    bumpMap: textureLoader.load('/textures/Earth/Bump.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = true;
        texture.anisotropy = 16;
    }),
    bumpScale: 0.05,
    roughnessMap: textureLoader.load('/textures/Earth/Albedo.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = true;
        texture.anisotropy = 16;
    }),
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
const cloudGeometry = new THREE.SphereGeometry(6.371 + 0.01, 256, 256);
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/Earth/Clouds.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = false;
        texture.anisotropy = 16;
    }),
    transparent: true,
    opacity: 0.4
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// Set initial cloud rotation to match Earth's rotation
clouds.rotation.y = earth.rotation.y;
earthGroup.add(clouds);

// Debug folder for clouds
const cloudsFolder = gui.addFolder('Clouds');
cloudsFolder.add(cloudMaterial, 'opacity').min(0).max(1).step(0.01);
cloudsFolder.add(clouds, 'visible');

// Create atmosphere
const atmosphereGeometry = new THREE.SphereGeometry(6.371 + 0.1, 64, 64);
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
    const x = THREE.MathUtils.randFloatSpread(60000);
    const y = THREE.MathUtils.randFloatSpread(60000);
    const z = THREE.MathUtils.randFloatSpread(60000);
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

// Debug folder for renderer
const rendererFolder = gui.addFolder('Renderer');
rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01);
rendererFolder.add(renderer, 'outputEncoding', {
    LinearEncoding: THREE.LinearEncoding,
    sRGBEncoding: THREE.sRGBEncoding
});

const envMap = textureLoader.load('textures/Gaia_EDR3_darkened.png');
envMap.mapping = THREE.EquirectangularReflectionMapping;
scene.background = envMap;

// Set initial rotation
earth.rotation.y = -0.3;
clouds.rotation.y = -0.3;

// Rotation and orbit speeds
let earthOrbitSpeed = 2 * Math.PI / 31557600; // Earth's base speed in radians per second
let moonOrbitSpeed = 2 * Math.PI / 2360448;   // Moon's base speed
let targetEarthOrbitSpeed = earthOrbitSpeed;
let targetMoonOrbitSpeed = moonOrbitSpeed;
let earthOrbitalAngle = 0;
let moonOrbitalAngle = 0;

// Earth's orbital period: 365.25 days
// Moon's orbital period: 27.32 days
// Earth's rotation period: 23.93 hours
// Moon's rotation period: 27.32 days (tidally locked)

// Add orbit speed controls to GUI
const orbitsFolder = gui.addFolder('Orbits');
orbitsFolder.add({ speed: 1 }, 'speed', 0, 10000, 0.1).onChange((value) => {
    timeScale = value; // Use the time scale to control all orbital speeds
}).name('Orbit Speed');

// Create Moon
const moonGeometry = new THREE.SphereGeometry(1.737, 128, 128); // Moon radius in thousands of km
const moonMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/Moon/moonmap4k.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = true;
        texture.anisotropy = 16;
    }),
    bumpMap: textureLoader.load('/textures/Moon/moonbump4k.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = true;
        texture.anisotropy = 16;
    }),
    bumpScale: 0.025,
    roughness: 0.8,
    metalness: 0.1
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Initialize moon physics properties
const G = 6.67430e-11; // Gravitational constant
const M_EARTH = 5.972e24; // Earth mass
const M_MOON = 7.342e22; // Moon mass
const SCALE_FACTOR = 1e-6; // Scale factor for visualization
const VELOCITY_SCALE = 1e-6; // Reduced velocity scale

// Set initial Moon position relative to Earth
moon.position.set(
    earthGroup.position.x + SCALE_FACTORS.MOON_ORBIT_RADIUS,
    earthGroup.position.y,
    earthGroup.position.z
);

// Calculate initial velocity for circular orbit
const orbitalSpeed = Math.sqrt((G * M_EARTH) / (SCALE_FACTORS.MOON_ORBIT_RADIUS * SCALE_FACTOR)) * VELOCITY_SCALE;
// Set initial velocity perpendicular to the Earth-Moon direction
const initialVelocity = new THREE.Vector3(0, 0, orbitalSpeed);
moon.userData = {
    initialized: true,
    velocity: initialVelocity,
    mass: M_MOON
};

// Create ISS group
const issGroup = new THREE.Group();
earthGroup.add(issGroup);

// Set initial ISS position
issGroup.position.set(SCALE_FACTORS.ISS_ORBIT_RADIUS, 0, 0);

// Load ISS model
const gltfLoader = new GLTFLoader();
let issModel;

gltfLoader.load(
    'models/International Space Station.glb',
    (gltf) => {
        issModel = gltf.scene;
        issModel.scale.set(0.005, 0.005, 0.005); // Adjust scale as needed
        issGroup.add(issModel);
    }
);

// ISS orbit parameters
const issOrbitRadius = 6.771; // ISS orbits at ~400km above Earth's surface (Earth radius 6.371 + 0.4)
let issOrbitSpeed = 2 * Math.PI / 5400; // ISS orbits once every 90 minutes (5400 seconds)
let issOrbitalAngle = 0;

// Camera target management
const cameraTargetManager = {
    targets: {},
    currentTarget: 'Sun',
    isTransitioning: false,
    startPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    TRANSITION_SPEED: 0.5,
    DISTANCE_THRESHOLD: 5,

    init() {
        this.targets = {
            Sun: sunGroup.position,
            Earth: earthGroup.position.clone(), // Clone the position to avoid reference issues
            Moon: new THREE.Vector3(),
            ISS: new THREE.Vector3()
        };

        // Set initial target
        this.targetPosition.copy(this.targets.Sun);
        controls.target.copy(this.targets.Sun);

        // Add camera target control to GUI
        const cameraFolder = gui.addFolder('Camera');
        cameraFolder.add({ target: 'Sun' }, 'target', Object.keys(this.targets)).onChange((value) => {
            if (value !== this.currentTarget) {
                this.currentTarget = value;
                this.isTransitioning = true;
                this.startPosition.copy(camera.position);
                this.startTarget.copy(controls.target);
            }
        });
    },

    calculateCameraPosition(target) {
        console.log('Calculating camera position for target:', this.currentTarget);
        console.log('Target position:', target);

        let cameraPosition;
        if (this.currentTarget === 'Sun') {
            cameraPosition = new THREE.Vector3(0, 0, 100);
        } else if (this.currentTarget === 'ISS') {
            cameraPosition = target.clone().add(new THREE.Vector3(0, 5, 10));
        } else if (this.currentTarget === 'Moon') {
            cameraPosition = target.clone().add(new THREE.Vector3(0, 5, 15));
        } else if (this.currentTarget === 'Earth') {
            // Adjusted Earth camera position
            cameraPosition = target.clone().add(new THREE.Vector3(0, 20, 50));
        } else {
            cameraPosition = target.clone().add(new THREE.Vector3(0, 50 * 0.4, 50));
        }

        console.log('Final camera position:', cameraPosition);
        return cameraPosition;
    },

    update() {
        // Physics constants
        const dt = 0.016 * timeScale; // Time step
        const FORCE_SCALE = 1e-20; // Scale factor for force

        // Update Earth's position in orbit
        const earthOrbitAngle = (Date.now() / 1000) * (2 * Math.PI / ORBITAL_PERIODS.EARTH);
        earthGroup.position.x = Math.cos(earthOrbitAngle) * SCALE_FACTORS.EARTH_ORBIT_RADIUS;
        earthGroup.position.z = Math.sin(earthOrbitAngle) * SCALE_FACTORS.EARTH_ORBIT_RADIUS;

        // Update target positions
        this.targets.Earth.copy(earthGroup.position);
        this.targets.Sun.copy(sunGroup.position);
        issGroup.getWorldPosition(this.targets.ISS);

        // Get Earth and Moon objects
        const earth = earthGroup.children[0];
        const moon = scene.children.find(child => child instanceof THREE.Mesh && child !== earth);
        moon.getWorldPosition(this.targets.Moon);

        // Calculate distance vector between Earth and Moon
        const distance = new THREE.Vector3().subVectors(moon.position, earthGroup.position);
        const distanceMagnitude = distance.length();

        // Calculate gravitational force with adjustable multiplier
        const baseForce = (G * M_EARTH * M_MOON) / (distanceMagnitude * distanceMagnitude);
        const forceMagnitude = baseForce * FORCE_SCALE * physicsDebug.gravityForce;
        const forceDirection = distance.normalize();
        const force = forceDirection.multiplyScalar(forceMagnitude);

        // Calculate acceleration
        const moonAcceleration = force.clone().divideScalar(M_MOON).negate();
        
        // Log the values for debugging
        console.log('Physics Debug:', {
            gravityForce: physicsDebug.gravityForce,
            baseForce: baseForce,
            forceMagnitude: forceMagnitude,
            acceleration: moonAcceleration.length(),
            distance: distanceMagnitude,
            velocity: moon.userData.velocity.length()
        });

        // Update velocity
        const moonVelocityChange = moonAcceleration.clone().multiplyScalar(dt);
        moon.userData.velocity.add(moonVelocityChange);

        // Update position
        const moonPositionChange = moon.userData.velocity.clone().multiplyScalar(dt);
        moon.position.add(moonPositionChange);

        // Reset moon if it gets too far from Earth
        const maxDistance = SCALE_FACTORS.MOON_ORBIT_RADIUS * 2;
        if (distanceMagnitude > maxDistance) {
            console.warn('Moon too far from Earth, resetting...');
            moon.position.set(
                earthGroup.position.x + SCALE_FACTORS.MOON_ORBIT_RADIUS,
                earthGroup.position.y,
                earthGroup.position.z
            );
            const orbitalSpeed = Math.sqrt((G * M_EARTH) / (SCALE_FACTORS.MOON_ORBIT_RADIUS * SCALE_FACTOR)) * VELOCITY_SCALE;
            // Set velocity perpendicular to the Earth-Moon direction
            const tangentDirection = new THREE.Vector3(-distance.z, 0, distance.x).normalize();
            moon.userData.velocity = tangentDirection.multiplyScalar(orbitalSpeed);
        }

        // Update debug vectors
        if (physicsDebug.showForceVector) {
            debugVectors.force.setDirection(forceDirection);
            debugVectors.force.setLength(forceMagnitude * 1000);
            debugVectors.force.position.copy(moon.position);
        }
        debugVectors.force.visible = physicsDebug.showForceVector;

        if (physicsDebug.showVelocityVector) {
            debugVectors.velocity.setDirection(moon.userData.velocity.normalize());
            debugVectors.velocity.setLength(moon.userData.velocity.length() * 1000);
            debugVectors.velocity.position.copy(moon.position);
        }
        debugVectors.velocity.visible = physicsDebug.showVelocityVector;

        if (physicsDebug.showAccelerationVector) {
            debugVectors.acceleration.setDirection(moonAcceleration.normalize());
            debugVectors.acceleration.setLength(moonAcceleration.length() * 10000);
            debugVectors.acceleration.position.copy(moon.position);
        }
        debugVectors.acceleration.visible = physicsDebug.showAccelerationVector;

        // Add debug info to panel
        if (physicsDebug.showEnergy || physicsDebug.showAngularMomentum) {
            const kineticEnergy = 0.5 * M_MOON * moon.userData.velocity.lengthSq();
            const potentialEnergy = -(G * M_EARTH * M_MOON) / distanceMagnitude * physicsDebug.gravityForce;
            const totalEnergy = kineticEnergy + potentialEnergy;
            
            const angularMomentum = distance.clone().cross(moon.userData.velocity).multiplyScalar(M_MOON);
            
            debugPanel.innerHTML = `
                ${physicsDebug.showEnergy ? `Total Energy: ${totalEnergy.toExponential(2)} J<br>` : ''}
                ${physicsDebug.showAngularMomentum ? `Angular Momentum: ${angularMomentum.length().toExponential(2)} kg⋅m²/s<br>` : ''}
                Force Magnitude: ${forceMagnitude.toExponential(2)} N<br>
                Acceleration: ${moonAcceleration.length().toExponential(2)} m/s²<br>
                Distance: ${distanceMagnitude.toFixed(2)} units<br>
                Velocity: ${moon.userData.velocity.length().toExponential(2)} m/s<br>
                Gravity Multiplier: ${physicsDebug.gravityForce.toFixed(2)}x
            `;
        }

        // Update Moon trail
        if (physicsDebug.showTrail) {
            const positions = moonTrail.geometry.attributes.position.array;
            
            // Shift all points back by one position
            for (let i = positions.length - 3; i > 0; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }
            
            // Add new point at the beginning
            positions[0] = moon.position.x;
            positions[1] = moon.position.y;
            positions[2] = moon.position.z;
            
            // Update the number of points to draw
            const newCount = Math.min(moonTrail.geometry.drawRange.count + 1, physicsDebug.trailLength);
            moonTrail.geometry.setDrawRange(0, newCount);
            moonTrail.geometry.attributes.position.needsUpdate = true;
            moonTrail.geometry.computeBoundingSphere();
        }
        moonTrail.visible = physicsDebug.showTrail;

        // Update Earth's rotation
        earth.rotation.y += (2 * Math.PI / (23.93 * 3600)) * dt;
        // Keep clouds rotation synchronized with Earth's rotation
        clouds.rotation.y = earth.rotation.y;

        // Update Moon's rotation (tidally locked)
        moon.rotation.y += (2 * Math.PI / (27.32 * 24 * 3600)) * dt;

        // Update target positions
        this.targets.Earth = earth.position;
        this.targets.Sun = sunGroup.position;
        moon.getWorldPosition(this.targets.Moon);
        issGroup.getWorldPosition(this.targets.ISS);

        // Handle camera transition
        if (this.isTransitioning) {
            const target = this.targets[this.currentTarget];
            const desiredPosition = this.calculateCameraPosition(target);
            
            // Validate target position
            if (target && !isNaN(target.x) && !isNaN(target.y) && !isNaN(target.z)) {
                camera.position.lerp(desiredPosition, this.TRANSITION_SPEED);
                this.targetPosition.lerp(target, this.TRANSITION_SPEED);
                controls.target.copy(this.targetPosition);

                const distanceToTarget = camera.position.distanceTo(desiredPosition);
                const targetDistance = this.targetPosition.distanceTo(target);

                if (distanceToTarget < this.DISTANCE_THRESHOLD && targetDistance < this.DISTANCE_THRESHOLD) {
                    this.isTransitioning = false;
                    controls.enabled = true;
                    camera.position.copy(desiredPosition);
                    this.targetPosition.copy(target);
                    controls.target.copy(target);
                }
            } else {
                console.warn('Invalid target position detected');
                this.isTransitioning = false;
                controls.enabled = true;
            }
        }
    }
};

// Initialize camera target manager
cameraTargetManager.init();

// Update render loop to use camera target manager
function renderLoop() {
    requestAnimationFrame(renderLoop);
    const delta = Math.max(clock.getDelta(), 0.0001);

    // Update planets and celestial bodies
    cameraTargetManager.update();
    updateControls();

    // Render scene
    renderer.render(scene, camera);
}

// Add time tracking variables
let simulationTime = new Date();
let timeScale = 1; // 1 second of real time = 1 second of simulation time

// Add after the renderer setup
const timeDisplay = document.createElement('div');
timeDisplay.style.position = 'absolute';
timeDisplay.style.top = '10px';
timeDisplay.style.left = '10px';
timeDisplay.style.color = 'white';
timeDisplay.style.fontFamily = 'Arial';
timeDisplay.style.fontSize = '16px';
timeDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
document.body.appendChild(timeDisplay);

// Add time scale control to GUI
const timeFolder = gui.addFolder('Time Controls');
timeFolder.add({ scale: timeScale }, 'scale', 1, 86400, 1).onChange((value) => {
    timeScale = value;
}).name('Time Scale (seconds)');

// Add date control to GUI
const dateFolder = gui.addFolder('Date Control');
const dateControl = {
    date: simulationTime.toISOString().split('T')[0]
};
dateFolder.add(dateControl, 'date').onChange((value) => {
    simulationTime = new Date(value);
    issOrbitalAngle = 0;
    updatePositionsFromDate(simulationTime, 0);
}).name('Simulation Date');

// Add orbital elements for planets (as of J2000 epoch)
const ORBITAL_ELEMENTS = {
    MERCURY: {
        a: 0.387098, // semi-major axis in AU
        e: 0.205630, // eccentricity
        i: 7.00487,  // inclination in degrees
        L: 252.25084, // mean longitude in degrees
        lp: 77.45645, // longitude of perihelion in degrees
        node: 48.33167 // longitude of ascending node in degrees
    },
    VENUS: {
        a: 0.723330,
        e: 0.006773,
        i: 3.39471,
        L: 181.97973,
        lp: 131.53298,
        node: 76.68069
    },
    EARTH: {
        a: 1.000000,
        e: 0.016709,
        i: 0.00000,
        L: 100.46435,
        lp: 102.94719,
        node: 0.00000
    },
    MARS: {
        a: 1.523688,
        e: 0.093405,
        i: 1.85061,
        L: 355.45332,
        lp: 336.04084,
        node: 49.57854
    },
    JUPITER: {
        a: 5.202561,
        e: 0.048498,
        i: 1.30530,
        L: 34.40438,
        lp: 14.72883,
        node: 100.55615
    },
    SATURN: {
        a: 9.554747,
        e: 0.054509,
        i: 2.48446,
        L: 49.94432,
        lp: 92.43194,
        node: 113.71504
    },
    URANUS: {
        a: 19.218140,
        e: 0.047318,
        i: 0.77464,
        L: 313.23218,
        lp: 170.96424,
        node: 74.22988
    },
    NEPTUNE: {
        a: 30.110387,
        e: 0.008606,
        i: 1.77004,
        L: 304.88003,
        lp: 44.97135,
        node: 131.72169
    },
    PLUTO: {
        a: 39.481686,
        e: 0.248808,
        i: 17.14175,
        L: 238.92881,
        lp: 224.06676,
        node: 110.30347
    },
    MOON: {
        a: 0.00257,  // Moon's semi-major axis in AU
        e: 0.0549,   // Moon's eccentricity
        i: 5.145,    // Moon's inclination in degrees
        L: 0,        // Mean longitude (not used for Moon)
        lp: 0,       // Longitude of perigee (not used for Moon)
        node: 0      // Longitude of ascending node (not used for Moon)
    }
};

// Function to calculate orbital position
function calculateOrbitalPosition(planet, time) {
    const period = ORBITAL_PERIODS[planet.toUpperCase()];
    const elements = ORBITAL_ELEMENTS[planet.toUpperCase()];
    
    if (!period || !elements) {
        console.warn(`Missing orbital data for ${planet}`);
        return { x: 0, y: 0, radius: 0 };
    }
    
    // Calculate mean anomaly
    const meanMotion = 2 * Math.PI / period;
    const meanAnomaly = (meanMotion * time) % (2 * Math.PI);
    
    // Solve Kepler's equation for eccentric anomaly
    let eccentricAnomaly = meanAnomaly;
    for (let i = 0; i < 10; i++) {
        const nextEccentricAnomaly = eccentricAnomaly - 
            (eccentricAnomaly - elements.e * Math.sin(eccentricAnomaly) - meanAnomaly) / 
            (1 - elements.e * Math.cos(eccentricAnomaly));
        if (Math.abs(nextEccentricAnomaly - eccentricAnomaly) < 1e-6) break;
        eccentricAnomaly = nextEccentricAnomaly;
    }
    
    // Calculate true anomaly
    const trueAnomaly = 2 * Math.atan(
        Math.sqrt((1 + elements.e) / (1 - elements.e)) * 
        Math.tan(eccentricAnomaly / 2)
    );
    
    // Calculate radius
    const radius = elements.a * (1 - elements.e * elements.e) / 
                  (1 + elements.e * Math.cos(trueAnomaly));
    
    // Calculate position
    const x = radius * Math.cos(trueAnomaly + elements.lp * Math.PI / 180);
    const y = radius * Math.sin(trueAnomaly + elements.lp * Math.PI / 180);
    
    return { x, y, radius };
}

// Function to update all positions based on date
function updatePositionsFromDate(date, delta) {
    const time = date.getTime() / 1000; // Convert to seconds
    
    // Update planet positions
    Object.entries(ORBITAL_ELEMENTS).forEach(([planet, elements]) => {
        const planetObj = planets[planet.toLowerCase()];
        if (planetObj) {
            const pos = calculateOrbitalPosition(planet, time);
            planetObj.position.x = pos.x * SCALE_FACTORS.AU_TO_UNITS;
            planetObj.position.z = pos.y * SCALE_FACTORS.AU_TO_UNITS;
            planetObj.userData.orbitalAngle = Math.atan2(pos.y, pos.x);
        }
    });

    // Update Earth group position
    const earthPos = calculateOrbitalPosition('EARTH', time);
    earthGroup.position.x = earthPos.x * SCALE_FACTORS.AU_TO_UNITS;
    earthGroup.position.z = earthPos.y * SCALE_FACTORS.AU_TO_UNITS;

    // Only update Moon position if gravity force is at default value
    if (physicsDebug.gravityForce === 1.0) {
        const moonAngle = (time * (2 * Math.PI / ORBITAL_PERIODS.MOON)) % (2 * Math.PI);
        const moonX = SCALE_FACTORS.MOON_ORBIT_RADIUS * Math.cos(moonAngle);
        const moonZ = SCALE_FACTORS.MOON_ORBIT_RADIUS * Math.sin(moonAngle);
        moon.position.set(moonX, 0, moonZ);
        moonOrbitalAngle = moonAngle;
    }

    // Update ISS position relative to Earth
    issOrbitalAngle += (2 * Math.PI / 5400) * delta * timeScale; // ISS orbits every 90 minutes
    const issX = SCALE_FACTORS.ISS_ORBIT_RADIUS * Math.cos(issOrbitalAngle);
    const issZ = SCALE_FACTORS.ISS_ORBIT_RADIUS * Math.sin(issOrbitalAngle);
    const issY = SCALE_FACTORS.ISS_ORBIT_RADIUS * Math.sin(issOrbitalAngle) * 0.1;
    
    issGroup.position.set(issX, issY, issZ);
    
    if (issModel) {
        issModel.rotation.y = issOrbitalAngle + Math.PI / 2;
    }
}

function updateControls() {
    // Update camera position based on movement state
    if (movementState.keys.forward) camera.position.z -= CONSTANTS.MOVE_SPEED;
    if (movementState.keys.backward) camera.position.z += CONSTANTS.MOVE_SPEED;
    if (movementState.keys.left) camera.position.x -= CONSTANTS.MOVE_SPEED;
    if (movementState.keys.right) camera.position.x += CONSTANTS.MOVE_SPEED;
    if (movementState.keys.up) camera.position.y += CONSTANTS.MOVE_SPEED;
    if (movementState.keys.down) camera.position.y -= CONSTANTS.MOVE_SPEED;

    // Update orbit controls
    controls.update();
}

// Create clock for timing
const clock = new THREE.Clock();

// Create debug visualization objects
const debugVectors = {
    force: new THREE.ArrowHelper(
        new THREE.Vector3(),
        new THREE.Vector3(),
        1,
        0xff0000
    ),
    velocity: new THREE.ArrowHelper(
        new THREE.Vector3(),
        new THREE.Vector3(),
        1,
        0x00ff00
    ),
    acceleration: new THREE.ArrowHelper(
        new THREE.Vector3(),
        new THREE.Vector3(),
        1,
        0x0000ff
    )
};

// Add debug vectors to scene instead of earthGroup
Object.values(debugVectors).forEach(vector => scene.add(vector));

// Create Moon trail
const moonTrailGeometry = new THREE.BufferGeometry();
const moonTrailMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5
});

// Initialize trail positions array
const trailLength = 1000; // Maximum number of points in the trail
const positions = new Float32Array(trailLength * 3); // 3 values (x,y,z) per point

// Initialize all positions to the Moon's initial position
const initialMoonPosition = new THREE.Vector3(
    earthGroup.position.x + SCALE_FACTORS.MOON_ORBIT_RADIUS,
    earthGroup.position.y,
    earthGroup.position.z
);
for (let i = 0; i < trailLength * 3; i += 3) {
    positions[i] = initialMoonPosition.x;
    positions[i + 1] = initialMoonPosition.y;
    positions[i + 2] = initialMoonPosition.z;
}

moonTrailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
moonTrailGeometry.setDrawRange(0, 1); // Start with one point drawn
moonTrailGeometry.computeBoundingSphere();

const moonTrail = new THREE.Line(moonTrailGeometry, moonTrailMaterial);
scene.add(moonTrail); // Add to scene instead of earthGroup

// Create debug panel
const debugPanel = document.createElement('div');
debugPanel.style.position = 'absolute';
debugPanel.style.top = '50px';
debugPanel.style.left = '10px';
debugPanel.style.color = 'white';
debugPanel.style.fontFamily = 'Arial';
debugPanel.style.fontSize = '14px';
debugPanel.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
debugPanel.style.backgroundColor = 'rgba(0,0,0,0.5)';
debugPanel.style.padding = '10px';
debugPanel.style.borderRadius = '5px';
document.body.appendChild(debugPanel);

// Add physics debug controls to GUI
const physicsFolder = gui.addFolder('Physics Debug');
const physicsDebug = {
    showForceVector: true,
    showVelocityVector: true,
    showAccelerationVector: true,
    showTrail: true,
    trailLength: 100,
    forceScale: 1e-20,
    showOrbitalElements: true,
    showEnergy: true,
    showAngularMomentum: true,
    gravityForce: 1.0 // New control for gravity force
};

physicsFolder.add(physicsDebug, 'showForceVector').name('Show Force Vector');
physicsFolder.add(physicsDebug, 'showVelocityVector').name('Show Velocity Vector');
physicsFolder.add(physicsDebug, 'showAccelerationVector').name('Show Acceleration Vector');
physicsFolder.add(physicsDebug, 'showTrail').name('Show Moon Trail');
physicsFolder.add(physicsDebug, 'trailLength', 10, 500).name('Trail Length');
physicsFolder.add(physicsDebug, 'forceScale', 1e-20, 100, 0.01).name('Force Scale');
physicsFolder.add(physicsDebug, 'showOrbitalElements').name('Show Orbital Elements');
physicsFolder.add(physicsDebug, 'showEnergy').name('Show Energy');
physicsFolder.add(physicsDebug, 'showAngularMomentum').name('Show Angular Momentum');
physicsFolder.add(physicsDebug, 'gravityForce', 0.1, 10.0, 0.1).name('Gravity Force Multiplier').onChange((value) => {
    // Reset moon position and velocity when gravity force changes
    const moon = scene.children.find(child => child instanceof THREE.Mesh && child !== earthGroup.children[0]);
    if (moon) {
        moon.position.set(
            earthGroup.position.x + SCALE_FACTORS.MOON_ORBIT_RADIUS,
            earthGroup.position.y,
            earthGroup.position.z
        );
        const orbitalSpeed = Math.sqrt((G * M_EARTH) / (SCALE_FACTORS.MOON_ORBIT_RADIUS * SCALE_FACTOR)) * VELOCITY_SCALE;
        // Set velocity perpendicular to the Earth-Moon direction
        const distance = new THREE.Vector3().subVectors(moon.position, earthGroup.position);
        const tangentDirection = new THREE.Vector3(-distance.z, 0, distance.x).normalize();
        moon.userData.velocity = tangentDirection.multiplyScalar(orbitalSpeed);
    }
});

// Initialize
renderLoop();

// Add debug logging function at the top of the file
function debugLog(category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${category}] ${message}`;
    console.log(logMessage);
    if (data) {
        console.log('Data:', data);
    }
}
