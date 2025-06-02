import * as THREE from 'three';

export class Planets {
    constructor() {
        this.planetsGroup = new THREE.Group();

        const textureLoader = new THREE.TextureLoader();

        // Create materials for each planet
        const mercuryMaterial = new THREE.MeshStandardMaterial({
            color: 0x8C8C8C,  // Gray
            roughness: 0.7,
            metalness: 0.1
        });

        const venusMaterial = new THREE.MeshStandardMaterial({
            color: 0xE39E1C,  // Yellowish-orange
            roughness: 0.8,
            metalness: 0.1,
            
            map: textureLoader.load('/textures/Planets/ven0aaa2.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        const marsMaterial = new THREE.MeshStandardMaterial({
            color: 0xC1440E,  // Reddish
            roughness: 0.7,
            metalness: 0.1,
            
            map: textureLoader.load('/textures/Planets/mar0kuu2.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        const jupiterMaterial = new THREE.MeshStandardMaterial({
            // color: 0xD8CA9D,  // Beige
            roughness: 0.8,
            metalness: 0.1,
            map: textureLoader.load('/textures/Planets/jup0vss1.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        const saturnMaterial = new THREE.MeshStandardMaterial({
            color: 0xE3B587,  // Light brown
            roughness: 0.7,
            metalness: 0.1,
            map: textureLoader.load('/textures/Planets/sat0fds1.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        const uranusMaterial = new THREE.MeshStandardMaterial({
            color: 0x5580AA,  // Light blue
            roughness: 0.6,
            metalness: 0.1
        });

        const neptuneMaterial = new THREE.MeshStandardMaterial({
            color: 0x366896,  // Dark blue
            roughness: 0.6,
            metalness: 0.1,
            
            map: textureLoader.load('/textures/Planets/nep0fds1.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        const plutoMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,  // Light gray
            roughness: 0.8,
            metalness: 0.1,
            
            map: textureLoader.load('/textures/Planets/plu0rss1.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
        });

        // Orbital periods in seconds
        const ORBITAL_PERIODS = {
            MERCURY: 7600320,    // 88 days
            VENUS: 19414080,     // 224.7 days
            EARTH: 31557600,     // 365.25 days
            MARS: 59356800,      // 687 days
            JUPITER: 374335200,  // 11.86 years
            SATURN: 929577600,   // 29.46 years
            URANUS: 2651371200,  // 84.01 years
            NEPTUNE: 5200416000, // 164.79 years
            PLUTO: 7819488000    // 248.09 years
        };

        // Mercury
        const mercuryGeometry = new THREE.SphereBufferGeometry(2.42, 128, 128); // Mercury's radius is 0.383x Earth's
        const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        mercury.position.set(1947, 0, 0); // Mercury's distance is 0.387 AU
        
        // Calculate Mercury's speed relative to Earth's orbit speed
        const baseSpeed = 2 * Math.PI / ORBITAL_PERIODS.EARTH; // Earth's base speed in radians per second
        const mercurySpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.MERCURY);
        
        mercury.userData = {
            orbitalAngle: 0,
            orbitalSpeed: mercurySpeed,
            targetOrbitalSpeed: mercurySpeed,
            orbitalRadius: 1947
        };

        // Venus
        const venusGeometry = new THREE.SphereBufferGeometry(6.04, 128, 128); // Venus's radius is 0.949x Earth's
        const venus = new THREE.Mesh(venusGeometry, venusMaterial);
        venus.position.set(3616, 0, 0); // Venus's distance is 0.723 AU

        const venusSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.VENUS);
        
        venus.userData = {
            orbitalAngle: 0,
            orbitalSpeed: venusSpeed,
            targetOrbitalSpeed: venusSpeed,
            orbitalRadius: 3616
        };
        
        // Mars
        const marsGeometry = new THREE.SphereBufferGeometry(3.39, 128, 128); // Mars's radius is 0.532x Earth's
        const mars = new THREE.Mesh(marsGeometry, marsMaterial);
        mars.position.set(7617, 0, 0); // Mars's distance is 1.524 AU

        const marsSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.MARS);
        
        mars.userData = {
            orbitalAngle: 0,
            orbitalSpeed: marsSpeed,
            targetOrbitalSpeed: marsSpeed,
            orbitalRadius: 7617
        };

        // Jupiter
        const jupiterGeometry = new THREE.SphereBufferGeometry(69.91, 256, 256); // Jupiter's radius is 10.97x Earth's
        const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
        jupiter.position.set(26000, 0, 0); // Jupiter's distance is 5.203 AU

        const jupiterSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.JUPITER);
        
        jupiter.userData = {
            orbitalAngle: 0,
            orbitalSpeed: jupiterSpeed,
            targetOrbitalSpeed: jupiterSpeed,
            orbitalRadius: 26000
        };

        // Saturn
        const saturnGeometry = new THREE.SphereBufferGeometry(58.23, 128, 128); // Saturn's radius is 9.14x Earth's
        const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturn.position.set(48000, 0, 0); // Saturn's distance is 9.537 AU

        const saturnSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.SATURN);
        
        saturn.userData = {
            orbitalAngle: 0,
            orbitalSpeed: saturnSpeed,
            targetOrbitalSpeed: saturnSpeed,
            orbitalRadius: 48000
        };

        // Uranus
        const uranusGeometry = new THREE.SphereBufferGeometry(25.36, 128, 128); // Uranus's radius is 3.98x Earth's
        const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
        uranus.position.set(96000, 0, 0); // Uranus's distance is 19.191 AU

        const uranusSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.URANUS);
        
        uranus.userData = {
            orbitalAngle: 0,
            orbitalSpeed: uranusSpeed,
            targetOrbitalSpeed: uranusSpeed,
            orbitalRadius: 96000
        };

        // Neptune
        const neptuneGeometry = new THREE.SphereBufferGeometry(24.62, 128, 128); // Neptune's radius is 3.86x Earth's
        const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
        neptune.position.set(150000, 0, 0); // Neptune's distance is 30.069 AU

        const neptuneSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.NEPTUNE);
        
        neptune.userData = {
            orbitalAngle: 0,
            orbitalSpeed: neptuneSpeed,
            targetOrbitalSpeed: neptuneSpeed,
            orbitalRadius: 150000
        };

        // Pluto
        const plutoGeometry = new THREE.SphereBufferGeometry(1.19, 128, 128); // Pluto's radius is 0.186x Earth's
        const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);
        pluto.position.set(197000, 0, 0); // Pluto's distance is 39.482 AU

        const plutoSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.PLUTO);
        
        pluto.userData = {
            orbitalAngle: 0,
            orbitalSpeed: plutoSpeed,
            targetOrbitalSpeed: plutoSpeed,
            orbitalRadius: 197000
        };

        // Make planets accessible for GUI controls
        this.mercury = mercury;
        this.venus = venus;
        this.mars = mars;
        this.jupiter = jupiter;
        this.saturn = saturn;
        this.uranus = uranus;
        this.neptune = neptune;
        this.pluto = pluto;
        
        // this.planetsGroup.add(mercury);
        // this.planetsGroup.add(venus);
        // this.planetsGroup.add(mars);
        // this.planetsGroup.add(jupiter);
        // this.planetsGroup.add(saturn);
        // this.planetsGroup.add(uranus);
        // this.planetsGroup.add(neptune);
        // this.planetsGroup.add(pluto);

        // Start the animation loop
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.updateOrbits();
    }

    updateOrbits() {
        // Update all planets in the group
        this.planetsGroup.children.forEach(planet => {
            if (planet.userData && planet.userData.orbitalSpeed) {
                // Smoothly transition orbital speed
                planet.userData.orbitalSpeed = THREE.MathUtils.lerp(
                    planet.userData.orbitalSpeed,
                    planet.userData.targetOrbitalSpeed,
                    0.05
                );

                // Update orbital angle
                planet.userData.orbitalAngle += planet.userData.orbitalSpeed * 0.01;
                
                // Update position
                planet.position.x = Math.cos(planet.userData.orbitalAngle) * planet.userData.orbitalRadius;
                planet.position.z = Math.sin(planet.userData.orbitalAngle) * planet.userData.orbitalRadius;
            }
        });
    }

    getPlanets() {
        return this.planetsGroup;
    }
}