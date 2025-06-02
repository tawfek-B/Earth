import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

export class Sun {
    constructor() {
        this.sunTexture = 'textures/8k_sun.jpg';
        this.group = new THREE.Group();
        this.loader = new THREE.TextureLoader();

        // Initialize properties
        this.corona = null;
        this.sunRim = null;
        this.glow = null;

        // Create components in correct order
        // this.createCorona();     //Theres an issue here
        this.createRim();
        this.addLighting();
        this.createGlow();
        this.createSun();

        this.animate = this.createAnimateFunction();
        this.animate();
    }

    createSun() {
        const map = this.loader.load(this.sunTexture);
        const sunGeometry = new THREE.SphereBufferGeometry(20, 128, 128);
        const sunMaterial = new THREE.MeshStandardMaterial({
            map,
            emissive: new THREE.Color(0x111100),
            emissiveIntensity: 1.5,
        });
        const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        this.group.add(sunMesh);

        if (this.sunRim) this.group.add(this.sunRim);
        if (this.corona) this.group.add(this.corona);
        if (this.glow) this.group.add(this.glow);

        this.group.userData.update = (t) => {
            this.group.rotation.y = -t / 5;
            if (this.corona && this.corona.userData && typeof this.corona.userData.update === 'function') {
                this.corona.userData.update(t);
            }
        };
    }

    createCorona() {
        try {
            // Create geometry and material
            const coronaGeometry = new THREE.SphereBufferGeometry(20.5, 128, 12812);
            const coronaMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.BackSide,
            });

            // Create mesh
            const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
            
            // Create noise generator
            const coronaNoise = new ImprovedNoise();

            // Store the geometry reference
            coronaMesh.userData.geometry = coronaGeometry;

            // Create update function
            const update = (t) => {
                try {
                    // Get the position attribute from the stored geometry
                    const geometry = coronaMesh.userData.geometry;
                    if (!geometry || !geometry.attributes || !geometry.attributes.position) {
                        console.warn('Corona geometry not properly initialized');
                        return;
                    }

                    const positions = geometry.attributes.position;
                    const vertex = new THREE.Vector3();
                    const temp = new THREE.Vector3();
                    
                    for (let i = 0; i < positions.count; i++) {
                        // Get current vertex position
                        vertex.fromBufferAttribute(positions, i);
                        
                        // Calculate noise
                        const noise = coronaNoise.noise(
                            vertex.x + Math.cos(t),
                            vertex.y + Math.sin(t),
                            vertex.z + t
                        );
                        
                        // Apply noise to vertex
                        temp.copy(vertex).normalize();
                        vertex.addScaledVector(temp, noise * 0.4);
                        
                        // Update vertex position
                        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
                    }
                    
                    // Mark positions as needing update
                    positions.needsUpdate = true;
                } catch (error) {
                    console.error('Error updating corona:', error);
                }
            };

            // Store update function
            coronaMesh.userData.update = update;
            
            // Store corona mesh
            this.corona = coronaMesh;
        } catch (error) {
            console.error('Error creating corona:', error);
            this.corona = null;
        }
    }

    createGlow() {
        try {
            const uniforms = {
                color1: { value: new THREE.Color(0x000000) },
                color2: { value: new THREE.Color(0xff0000) },
                fresnelBias: { value: 0.2 },
                fresnelScale: { value: 1.5 },
                fresnelPower: { value: 4.0 },
            };

            const vertexShader = `
            uniform float fresnelBias;
            uniform float fresnelScale;
            uniform float fresnelPower;

            varying float vReflectionFactor;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

                vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

                vec3 I = worldPosition.xyz - cameraPosition;

                vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

                gl_Position = projectionMatrix * mvPosition;
            }
            `;

            const fragmentShader = `
            uniform vec3 color1;
            uniform vec3 color2;

            varying float vReflectionFactor;

            void main() {
                float f = clamp( vReflectionFactor, 0.0, 1.0 );
                gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
            }
            `;

            const sunGlowMaterial = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
            });
            const sunGlowGeometry = new THREE.SphereBufferGeometry(20.5, 128, 128);
            const sunGlowMesh = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
            sunGlowMesh.scale.setScalar(1.1);
            this.glow = sunGlowMesh;
        } catch (error) {
            console.error('Error creating glow:', error);
            this.glow = null;
        }
    }

    createRim() {
        try {
            const uniforms = {
                color1: { value: new THREE.Color(0xffff99) },
                color2: { value: new THREE.Color(0x000000) },
                fresnelBias: { value: 0.2 },
                fresnelScale: { value: 1.5 },
                fresnelPower: { value: 4.0 },
            };

            const vertexShader = `
            uniform float fresnelBias;
            uniform float fresnelScale;
            uniform float fresnelPower;

            varying float vReflectionFactor;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

                vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

                vec3 I = worldPosition.xyz - cameraPosition;

                vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

                gl_Position = projectionMatrix * mvPosition;
            }
            `;

            const fragmentShader = `
            uniform vec3 color1;
            uniform vec3 color2;

            varying float vReflectionFactor;

            void main() {
                float f = clamp( vReflectionFactor, 0.0, 1.0 );
                gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
            }
            `;

            const sunRimMaterial = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
            });
            const sunRimGeometry = new THREE.SphereBufferGeometry(20.5, 128, 128);
            const sunRimMesh = new THREE.Mesh(sunRimGeometry, sunRimMaterial);
            sunRimMesh.scale.setScalar(1.01);
            this.sunRim = sunRimMesh;
        } catch (error) {
            console.error('Error creating rim:', error);
            this.sunRim = null;
        }
    }

    addLighting() {
        try {
            this.sunLight = new THREE.PointLight(0xffff99, 2);
            this.sunLight.position.set(0, 0, 0);
            this.group.add(this.sunLight);
        } catch (error) {
            console.error('Error adding lighting:', error);
        }
    }

    createAnimateFunction() {
        return (t = 0) => {
            try {
                const time = t * 0.00051;
                requestAnimationFrame(this.animate);
                if (this.group && this.group.userData && typeof this.group.userData.update === 'function') {
                    this.group.userData.update(time);
                }
            } catch (error) {
                console.error('Error in animation:', error);
            }
        };
    }

    getSun() {
        return this.group;
    }
} 