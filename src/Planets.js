import * as THREE from 'three';

export class Planets {
    constructor() {
        const texureLoader = new THREE.TextureLoader();

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
            color: 0xE3B587,  // Light brown
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
            metalness: 0.1,
            map: textureLoader.load('textures/Planets/uranus.jpg')
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
            MERCURY: 7600543,    // 87.97 days
            VENUS: 19414080,     // 224.70 days
            EARTH: 31557600,     // 365.25 days
            MARS: 59354112,      // 686.98 days
            JUPITER: 374335776,  // 11.86 years
            SATURN: 929596608,   // 29.46 years
            URANUS: 2651370720,  // 84.01 years
            NEPTUNE: 5200204800, // 164.79 years
            PLUTO: 7819584000    // 248.00 years
        };

        // Get current time in seconds since epoch
        const now = Date.now() / 1000;
        // Helper to calculate mean anomaly (angle) for a given period
        function getInitialAngle(period) {
            return (2 * Math.PI * (now % period) / period);
        }

        // Mercury (no moons)
        const mercuryGeometry = new THREE.SphereBufferGeometry(2.42, 128, 128); // Mercury's radius is 0.383x Earth's
        const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        mercury.position.set(1947, 0, 0); // Mercury's distance is 0.387 AU
        const baseSpeed = 2 * Math.PI / ORBITAL_PERIODS.EARTH; // Earth's base speed in radians per second
        const mercurySpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.MERCURY);
        mercury.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.MERCURY),
            orbitalSpeed: mercurySpeed,
            targetOrbitalSpeed: mercurySpeed,
            orbitalRadius: 1947
        };

        // Venus (no moons)
        const venusGeometry = new THREE.SphereBufferGeometry(6.04, 128, 128); // Venus's radius is 0.949x Earth's
        const venus = new THREE.Mesh(venusGeometry, venusMaterial);
        venus.position.set(3616, 0, 0); // Venus's distance is 0.723 AU
        const venusSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.VENUS);
        venus.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.VENUS),
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
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.MARS),
            orbitalSpeed: marsSpeed,
            targetOrbitalSpeed: marsSpeed,
            orbitalRadius: 7617
        };
        // Mars moons: Phobos, Deimos
        const phobosGeometry = new THREE.SphereBufferGeometry(0.07, 32, 32); // 22.2 km
        const deimosGeometry = new THREE.SphereBufferGeometry(0.04, 32, 32); // 12.6 km
        const phobos = new THREE.Mesh(phobosGeometry, new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 }));
        phobos.material = phobos.material.clone();
        const deimos = new THREE.Mesh(deimosGeometry, new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 }));
        deimos.material = deimos.material.clone();
        phobos.position.set(0, 0, 12); // 9,376 km from Mars center, scaled
        deimos.position.set(0, 0, 20); // 23,463 km from Mars center, scaled
        phobos.userData = { orbitalAngle: getInitialAngle(7.65 * 3600), orbitalSpeed: 2 * Math.PI / (7.65 * 3600), orbitalRadius: 12, rotationPeriod: 7.65 * 3600 };
        deimos.userData = { orbitalAngle: getInitialAngle(30.35 * 3600), orbitalSpeed: 2 * Math.PI / (30.35 * 3600), orbitalRadius: 20, rotationPeriod: 30.35 * 3600 };
        mars.add(phobos);
        mars.add(deimos);
        mars.moons = [phobos, deimos];

        
        mars.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/mars.png', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
            moon.scale.set(1,1,1);
        });

        // Jupiter
        const jupiterGeometry = new THREE.SphereBufferGeometry(69.91, 256, 256); // Jupiter's radius is 10.97x Earth's
        const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
        jupiter.position.set(26000, 0, 0); // Jupiter's distance is 5.203 AU
        const jupiterSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.JUPITER);
        jupiter.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.JUPITER),
            orbitalSpeed: jupiterSpeed,
            targetOrbitalSpeed: jupiterSpeed,
            orbitalRadius: 26000
        };
        // Jupiter rings (to scale, faint)
        const jupiterRingInner = 1.2 * 69.91; // Jupiter radius = 69.91, ring inner ~1.2x
        const jupiterRingOuter = 1.7 * 69.91; // ring outer ~1.7x
        const jupiterRingGeometry = new THREE.RingGeometry(jupiterRingInner, jupiterRingOuter, 128);
        const jupiterRingMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: 0.15, map: textureLoader.load('/textures/Planets/rings2.png')});
        const jupiterRing = new THREE.Mesh(jupiterRingGeometry, jupiterRingMaterial);
        jupiterRing.rotation.x = Math.PI / 2;
        jupiter.add(jupiterRing);

        // Jupiter moons: Io, Europa, Ganymede, Callisto
        const io = new THREE.Mesh(new THREE.SphereBufferGeometry(0.29, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 1821.6 km
        io.material = io.material.clone();
        const europa = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 1560.8 km
        europa.material = europa.material.clone();
        const ganymede = new THREE.Mesh(new THREE.SphereBufferGeometry(0.41, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 2634.1 km
        ganymede.material = ganymede.material.clone();
        const callisto = new THREE.Mesh(new THREE.SphereBufferGeometry(0.38, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 2410.3 km
        callisto.material = callisto.material.clone();
        io.position.set(0, 0, 90); // 421,700 km from Jupiter, scaled
        europa.position.set(0, 0, 144); // 671,034 km
        ganymede.position.set(0, 0, 192); // 1,070,412 km
        callisto.position.set(0, 0, 271); // 1,882,709 km
        io.userData = { orbitalAngle: getInitialAngle(1.769 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (1.769 * 24 * 3600), orbitalRadius: 90, rotationPeriod: 1.769 * 24 * 3600 };
        europa.userData = { orbitalAngle: getInitialAngle(3.551 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (3.551 * 24 * 3600), orbitalRadius: 144, rotationPeriod: 3.551 * 24 * 3600 };
        ganymede.userData = { orbitalAngle: getInitialAngle(7.154 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (7.154 * 24 * 3600), orbitalRadius: 192, rotationPeriod: 7.154 * 24 * 3600 };
        callisto.userData = { orbitalAngle: getInitialAngle(16.689 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (16.689 * 24 * 3600), orbitalRadius: 271, rotationPeriod: 16.689 * 24 * 3600 };
        jupiter.add(io);
        jupiter.add(europa);
        jupiter.add(ganymede);
        jupiter.add(callisto);
        jupiter.moons = [io, europa, ganymede, callisto];

        jupiter.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/jupiter.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
            moon.scale.set(1,1,1);
        });

        // Saturn
        const saturnGeometry = new THREE.SphereBufferGeometry(58.23, 128, 128); // Saturn's radius is 9.14x Earth's
        const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturn.position.set(48000, 0, 0); // Saturn's distance is 9.537 AU
        const saturnSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.SATURN);
        saturn.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.SATURN),
            orbitalSpeed: saturnSpeed,
            targetOrbitalSpeed: saturnSpeed,
            orbitalRadius: 48000
        };
        // Saturn's rings (to scale, fixed proportions)
        const saturnRingTexture = textureLoader.load('/textures/Planets/rings2.png');
        const saturnRadius = 58.23;
        const saturnRingInner = 1.11 * saturnRadius; // C ring inner edge
        const saturnRingOuter = 2.5 * saturnRadius;  // A ring outer edge
        const saturnRingGeometry = new THREE.RingGeometry(saturnRingInner, saturnRingOuter, 256);
        saturn.rotation.z = -Math.PI / 8;
        const saturnRingMaterial = new THREE.MeshBasicMaterial({
            map: saturnRingTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
        });
        const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
        saturnRing.rotation.x = Math.PI / 2;
        saturn.add(saturnRing);

        // Saturn moons: Titan, Rhea, Iapetus, Dione, Tethys, Enceladus, Mimas
        const titan = new THREE.Mesh(new THREE.SphereBufferGeometry(0.40, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 2575 km
        titan.material = titan.material.clone();
        const rhea = new THREE.Mesh(new THREE.SphereBufferGeometry(0.15, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 763.8 km
        rhea.material = rhea.material.clone();
        const iapetus = new THREE.Mesh(new THREE.SphereBufferGeometry(0.18, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 734.5 km
        iapetus.material = iapetus.material.clone();
        const dione = new THREE.Mesh(new THREE.SphereBufferGeometry(0.14, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 561.4 km
        dione.material = dione.material.clone();
        const tethys = new THREE.Mesh(new THREE.SphereBufferGeometry(0.11, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 531.1 km
        tethys.material = tethys.material.clone();
        const enceladus = new THREE.Mesh(new THREE.SphereBufferGeometry(0.08, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 252.1 km
        enceladus.material = enceladus.material.clone();
        const mimas = new THREE.Mesh(new THREE.SphereBufferGeometry(0.06, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 198.2 km
        mimas.material = mimas.material.clone();
        titan.position.set(0, 0, 400); // 1,221,870 km
        rhea.position.set(0, 0, 527); // 527,108 km
        iapetus.position.set(0, 0, 356); // 3,560,820 km (scaled down for visualization)
        dione.position.set(0, 0, 377); // 377,400 km
        tethys.position.set(0, 0, 295); // 294,660 km
        enceladus.position.set(0, 0, 238); // 237,948 km
        mimas.position.set(0, 0, 186); // 185,539 km
        titan.userData = { orbitalAngle: getInitialAngle(15.945 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (15.945 * 24 * 3600), orbitalRadius: 400, rotationPeriod: 15.945 * 24 * 3600 };
        rhea.userData = { orbitalAngle: getInitialAngle(4.518 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (4.518 * 24 * 3600), orbitalRadius: 527, rotationPeriod: 4.518 * 24 * 3600 };
        iapetus.userData = { orbitalAngle: getInitialAngle(79.3215 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (79.3215 * 24 * 3600), orbitalRadius: 356, rotationPeriod: 79.3215 * 24 * 3600 };
        dione.userData = { orbitalAngle: getInitialAngle(2.737 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (2.737 * 24 * 3600), orbitalRadius: 377, rotationPeriod: 2.737 * 24 * 3600 };
        tethys.userData = { orbitalAngle: getInitialAngle(1.888 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (1.888 * 24 * 3600), orbitalRadius: 295, rotationPeriod: 1.888 * 24 * 3600 };
        enceladus.userData = { orbitalAngle: getInitialAngle(1.370 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (1.370 * 24 * 3600), orbitalRadius: 238, rotationPeriod: 1.370 * 24 * 3600 };
        mimas.userData = { orbitalAngle: getInitialAngle(0.942 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (0.942 * 24 * 3600), orbitalRadius: 186, rotationPeriod: 0.942 * 24 * 3600 };
        saturn.add(titan);
        saturn.add(rhea);
        saturn.add(iapetus);
        saturn.add(dione);
        saturn.add(tethys);
        saturn.add(enceladus);
        saturn.add(mimas);
        saturn.moons = [titan, rhea, iapetus, dione, tethys, enceladus, mimas];

        
        saturn.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/saturn.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })

            moon.scale.set(5,5,5)
        });

        // Uranus
        const uranusGeometry = new THREE.SphereBufferGeometry(25.36, 128, 128); // Uranus's radius is 3.98x Earth's
        const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
        uranus.position.set(96000, 0, 0); // Uranus's distance is 19.191 AU
        const uranusSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.URANUS);
        uranus.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.URANUS),
            orbitalSpeed: uranusSpeed,
            targetOrbitalSpeed: uranusSpeed,
            orbitalRadius: 96000
        };
        // Uranus rings (to scale, faint)
        const uranusRingInner = 1.4 * 25.36; // Uranus radius = 25.36, ring inner ~1.4x
        const uranusRingOuter = 2.0 * 25.36; // ring outer ~2.0x
        const uranusRingGeometry = new THREE.RingGeometry(uranusRingInner, uranusRingOuter, 128);
        const uranusRingMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.18, map: textureLoader.load('/textures/Planets/rings2.png')});
        const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
        uranusRing.rotation.x = Math.PI / 2;
        uranus.add(uranusRing);

        // Uranus moons: Titania, Oberon, Umbriel, Ariel, Miranda
        const titania = new THREE.Mesh(new THREE.SphereBufferGeometry(0.16, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 788.9 km
        titania.material = titania.material.clone();
        const oberon = new THREE.Mesh(new THREE.SphereBufferGeometry(0.15, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 761.4 km
        oberon.material = oberon.material.clone();
        const umbriel = new THREE.Mesh(new THREE.SphereBufferGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 584.7 km
        umbriel.material = umbriel.material.clone();
        const ariel = new THREE.Mesh(new THREE.SphereBufferGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 578.9 km
        ariel.material = ariel.material.clone();
        const miranda = new THREE.Mesh(new THREE.SphereBufferGeometry(0.08, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 235.8 km
        miranda.material = miranda.material.clone();
        titania.position.set(0, 0, 436); // 435,910 km
        oberon.position.set(0, 0, 583); // 583,520 km
        umbriel.position.set(0, 0, 266); // 266,000 km
        ariel.position.set(0, 0, 191); // 190,900 km
        miranda.position.set(0, 0, 130); // 129,900 km
        titania.userData = { orbitalAngle: getInitialAngle(8.706 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (8.706 * 24 * 3600), orbitalRadius: 436, rotationPeriod: 8.706 * 24 * 3600 };
        oberon.userData = { orbitalAngle: getInitialAngle(13.463 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (13.463 * 24 * 3600), orbitalRadius: 583, rotationPeriod: 13.463 * 24 * 3600 };
        umbriel.userData = { orbitalAngle: getInitialAngle(4.144 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (4.144 * 24 * 3600), orbitalRadius: 266, rotationPeriod: 4.144 * 24 * 3600 };
        ariel.userData = { orbitalAngle: getInitialAngle(2.520 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (2.520 * 24 * 3600), orbitalRadius: 191, rotationPeriod: 2.520 * 24 * 3600 };
        miranda.userData = { orbitalAngle: getInitialAngle(1.413 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (1.413 * 24 * 3600), orbitalRadius: 130, rotationPeriod: 1.413 * 24 * 3600 };
        uranus.add(titania);
        uranus.add(oberon);
        uranus.add(umbriel);
        uranus.add(ariel);
        uranus.add(miranda);
        uranus.moons = [titania, oberon, umbriel, ariel, miranda];

        uranus.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/uranus.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
            moon.scale.set(3,3,3);
        });

        // Neptune
        const neptuneGeometry = new THREE.SphereBufferGeometry(24.62, 128, 128); // Neptune's radius is 3.86x Earth's
        const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
        neptune.position.set(150000, 0, 0); // Neptune's distance is 30.069 AU
        const neptuneSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.NEPTUNE);
        neptune.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.NEPTUNE),
            orbitalSpeed: neptuneSpeed,
            targetOrbitalSpeed: neptuneSpeed,
            orbitalRadius: 150000
        };
        // Neptune rings (to scale, faint)
        const neptuneRingInner = 1.2 * 24.62; // Neptune radius = 24.62, ring inner ~1.2x
        const neptuneRingOuter = 1.7 * 24.62; // ring outer ~1.7x
        const neptuneRingGeometry = new THREE.RingGeometry(neptuneRingInner, neptuneRingOuter, 128);
        const neptuneRingMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide, transparent: true, opacity: 0.16, map: textureLoader.load('/textures/Planets/rings2.png')});
        const neptuneRing = new THREE.Mesh(neptuneRingGeometry, neptuneRingMaterial);
        neptuneRing.rotation.x = Math.PI / 2;
        neptune.add(neptuneRing);
        // Neptune moons: Triton, Proteus, Nereid, Larissa
        const triton = new THREE.Mesh(new THREE.SphereBufferGeometry(0.21, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 1353.4 km
        triton.material = triton.material.clone();
        const proteus = new THREE.Mesh(new THREE.SphereBufferGeometry(0.07, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 210 km
        proteus.material = proteus.material.clone();
        const nereid = new THREE.Mesh(new THREE.SphereBufferGeometry(0.06, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 170 km
        nereid.material = nereid.material.clone();
        const larissa = new THREE.Mesh(new THREE.SphereBufferGeometry(0.04, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 97 km
        larissa.material = larissa.material.clone();
        triton.position.set(0, 0, 354); // 354,759 km
        proteus.position.set(0, 0, 118); // 117,647 km
        nereid.position.set(0, 0, 551); // 5,513,400 km (scaled down for visualization)
        larissa.position.set(0, 0, 74); // 73,548 km
        triton.userData = { orbitalAngle: getInitialAngle(5.877 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (5.877 * 24 * 3600), orbitalRadius: 354, rotationPeriod: 5.877 * 24 * 3600 };
        proteus.userData = { orbitalAngle: getInitialAngle(1.122 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (1.122 * 24 * 3600), orbitalRadius: 118, rotationPeriod: 1.122 * 24 * 3600 };
        nereid.userData = { orbitalAngle: getInitialAngle(360.13 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (360.13 * 24 * 3600), orbitalRadius: 551, rotationPeriod: 360.13 * 24 * 3600 };
        larissa.userData = { orbitalAngle: getInitialAngle(0.555 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (0.555 * 24 * 3600), orbitalRadius: 74, rotationPeriod: 0.555 * 24 * 3600 };
        neptune.add(triton);
        neptune.add(proteus);
        neptune.add(nereid);
        neptune.add(larissa);
        neptune.moons = [triton, proteus, nereid, larissa];

        
        neptune.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/neptune.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
            moon.scale.set(5,5,5);
        });

        // Pluto
        const plutoGeometry = new THREE.SphereBufferGeometry(1.19, 128, 128); // Pluto's radius is 0.186x Earth's
        const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);
        pluto.position.set(197000, 0, 0); // Pluto's distance is 39.482 AU
        const plutoSpeed = baseSpeed * (ORBITAL_PERIODS.EARTH / ORBITAL_PERIODS.PLUTO);
        pluto.userData = {
            orbitalAngle: getInitialAngle(ORBITAL_PERIODS.PLUTO),
            orbitalSpeed: plutoSpeed,
            targetOrbitalSpeed: plutoSpeed,
            orbitalRadius: 197000
        };
        // Pluto moons: Charon, Nix, Hydra, Kerberos, Styx


        const charon = new THREE.Mesh(new THREE.SphereBufferGeometry(0.06, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 606 km
        charon.material = charon.material.clone();
        const nix = new THREE.Mesh(new THREE.SphereBufferGeometry(0.02, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 49.8 km
        nix.material = nix.material.clone();
        const hydra = new THREE.Mesh(new THREE.SphereBufferGeometry(0.02, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 43.0 km
        hydra.material = hydra.material.clone();
        const kerberos = new THREE.Mesh(new THREE.SphereBufferGeometry(0.01, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 19 km
        kerberos.material = kerberos.material.clone();
        const styx = new THREE.Mesh(new THREE.SphereBufferGeometry(0.01, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 })); // 10 km
        styx.material = styx.material.clone();

        charon.position.set(0, 0, 19); // 19,591 km
        nix.position.set(0, 0, 49); // 48,694 km
        hydra.position.set(0, 0, 64); // 64,738 km
        kerberos.position.set(0, 0, 58); // 57,783 km
        styx.position.set(0, 0, 42); // 42,656 km
        charon.userData = { orbitalAngle: getInitialAngle(6.387 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (6.387 * 24 * 3600), orbitalRadius: 19, rotationPeriod: 6.387 * 24 * 3600 };
        nix.userData = { orbitalAngle: getInitialAngle(24.854 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (24.854 * 24 * 3600), orbitalRadius: 49, rotationPeriod: 24.854 * 24 * 3600 };
        hydra.userData = { orbitalAngle: getInitialAngle(38.2 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (38.2 * 24 * 3600), orbitalRadius: 64, rotationPeriod: 38.2 * 24 * 3600 };
        kerberos.userData = { orbitalAngle: getInitialAngle(32.167 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (32.167 * 24 * 3600), orbitalRadius: 58, rotationPeriod: 32.167 * 24 * 3600 };
        styx.userData = { orbitalAngle: getInitialAngle(20.16155 * 24 * 3600), orbitalSpeed: 2 * Math.PI / (20.16155 * 24 * 3600), orbitalRadius: 42, rotationPeriod: 20.16155 * 24 * 3600 };
        pluto.add(charon);
        pluto.add(nix);
        pluto.add(hydra);
        pluto.add(kerberos);
        pluto.add(styx);
        pluto.moons = [charon, nix, hydra, kerberos, styx];


        pluto.moons.forEach(moon => {
            moon.material.map = textureLoader.load('textures/Moons/pluto.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = true;
                texture.anisotropy = 16;
            })
            moon.scale.set(2,2,2);
        });

        // Add planets to the group and as properties
        this.mercury = mercury;
        this.venus = venus;
        this.mars = mars;
        this.jupiter = jupiter;
        this.saturn = saturn;
        this.saturnRing = saturnRing;
        this.uranus = uranus;
        this.neptune = neptune;
        this.pluto = pluto;

        this.planetsGroup.add(mercury);
        this.planetsGroup.add(venus);
        this.planetsGroup.add(mars);
        this.planetsGroup.add(jupiter);
        this.planetsGroup.add(saturn);
        this.planetsGroup.add(uranus);
        this.planetsGroup.add(neptune);
        this.planetsGroup.add(pluto);

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
            // Update moons
            if (planet.moons) {
                planet.moons.forEach(moon => {
                    moon.userData.orbitalAngle += moon.userData.orbitalSpeed * 0.01;
                    moon.position.x = Math.cos(moon.userData.orbitalAngle) * moon.userData.orbitalRadius;
                    moon.position.z = Math.sin(moon.userData.orbitalAngle) * moon.userData.orbitalRadius;
                    // Tidal lock (most major moons)
                    moon.rotation.y = moon.userData.orbitalAngle;
                });
            }
        });
    }

    getPlanets() {
        return this.planetsGroup;
    }
}
