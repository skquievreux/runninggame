// js/Environment.js - Hintergrund, Boden, Wolken
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

export class Environment {
    constructor() {
        this.createBackground();
        this.createGround();
    }

    createBackground() {
        // Sky gradient - now at the bottom
        const skyGeometry = new THREE.PlaneGeometry(2000, 1000); // Vergrößert für vollständige Abdeckung
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                bottomColor: { value: new THREE.Color(0x0077FF) },  // Blauer Himmel unten
                topColor: { value: new THREE.Color(0xADD8E6) } // Hellerer Himmel oben
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
                }
            `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        sky.position.z = -100;
        sky.position.y = -100; // Himmel ist jetzt unten
        sceneManager.addToScene(sky);

        // Create mountains
        this.createMountains();

        // Create clouds
        this.createClouds();
    }

    createMountains() {
        const mountainGeometry = new THREE.BufferGeometry();
        const mountainPoints = [];

        // Create jagged mountain silhouette
        mountainPoints.push(new THREE.Vector3(-100, -10, -50));

        // Generate random mountain peaks
        for (let i = -100; i <= 100; i += 10) {
            const height = Math.random() * 15 + 5;
            mountainPoints.push(new THREE.Vector3(i, height, -50));
        }

        mountainPoints.push(new THREE.Vector3(100, -10, -50));

        // Create mountain shape
        const mountainShape = new THREE.Shape();
        mountainShape.moveTo(mountainPoints[0].x, mountainPoints[0].y);

        for (let i = 1; i < mountainPoints.length; i++) {
            mountainShape.lineTo(mountainPoints[i].x, mountainPoints[i].y);
        }

        const mountainGeom = new THREE.ShapeGeometry(mountainShape);
        const mountainMaterial = new THREE.MeshLambertMaterial({
            color: 0x4B6455,  // Dunkelgrün/Grau für Berge
            side: THREE.DoubleSide
        });

        const mountains = new THREE.Mesh(mountainGeom, mountainMaterial);
        mountains.position.y = 0;
        sceneManager.addToScene(mountains);
    }

    createClouds() {
        for (let i = 0; i < 20; i++) {
            const cloudGeometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 8, 8);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8
            });

            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

            // Random position
            cloud.position.x = Math.random() * 200 - 100;
            cloud.position.y = Math.random() * 20 + 20;
            cloud.position.z = -40 - Math.random() * 10;

            // Flatten the cloud
            cloud.scale.y = 0.5;
            cloud.scale.x = Math.random() * 1 + 1;

            sceneManager.addToScene(cloud);

            // Add to game clouds array for animation
            game.clouds.push(cloud);
        }
    }

    createGround() {
        // Create a textured ground material
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Fill with base color
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 512, 512);

        // Add some noise/texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 3 + 1;
            const brightness = Math.random() * 40 - 20;

            ctx.fillStyle = `rgb(${128 + brightness}, ${128 + brightness}, ${128 + brightness})`;
            ctx.fillRect(x, y, size, size);
        }

        // Add some lines to simulate road markings
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(256, 0);
        ctx.lineTo(256, 512);
        ctx.stroke();

        // Create texture from canvas
        const groundTexture = new THREE.CanvasTexture(canvas);
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(1, 4);

        // Create enhanced material
        const groundMaterial = new THREE.MeshPhongMaterial({
            map: groundTexture,
            shininess: 10,
            specular: 0x333333
        });

        // Create ground segments
        for (let i = 0; i < game.groundSegments; i++) {
            if (Math.random() > 0.2) { // 80% chance to create ground, 20% chance to create a gap
                const groundGeometry = new THREE.BoxGeometry(game.groundWidth, 0.5, 4);
                const groundPiece = new THREE.Mesh(groundGeometry, groundMaterial);
                groundPiece.position.x = i * game.groundWidth;
                groundPiece.position.y = -0.25; // Boden ist unten
                groundPiece.receiveShadow = true; // Receive shadows
                sceneManager.addToScene(groundPiece);
                game.ground.push(groundPiece);
            } else {
                game.ground.push(null); // Add null to the array to represent a gap
            }
        }
    }

    updateClouds() {
        // Animate clouds
        game.clouds.forEach(cloud => {
            cloud.position.x -= 0.01; // Move clouds slowly to the left
            if (cloud.position.x < -150) {
                cloud.position.x = 150; // Reset position when off screen
            }
        });
    }
}

export let environment = new Environment();