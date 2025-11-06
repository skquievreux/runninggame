// js/Player.js - Spieler-Objekt und Bewegung
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

export class Player {
    constructor() {
        this.createPlayer();
        this.setupMovement();
    }

    createPlayer() {
        // Player - Würfel mit verschiedenen Farben für jede Seite
        const playerGeometry = new THREE.BoxGeometry(1, 1, 1);

        // Würfel-Materialien mit verschiedenen Farben für jede Seite
        const playerMaterials = [
            new THREE.MeshPhongMaterial({ color: 0xFF0000, specular: 0xffffff, shininess: 100 }), // rechts - rot
            new THREE.MeshPhongMaterial({ color: 0x00FF00, specular: 0xffffff, shininess: 100 }), // links - grün
            new THREE.MeshPhongMaterial({ color: 0x0000FF, specular: 0xffffff, shininess: 100 }), // oben - blau
            new THREE.MeshPhongMaterial({ color: 0xFFFF00, specular: 0xffffff, shininess: 100 }), // unten - gelb
            new THREE.MeshPhongMaterial({ color: 0xFF00FF, specular: 0xffffff, shininess: 100 }), // vorne - magenta
            new THREE.MeshPhongMaterial({ color: 0x00FFFF, specular: 0xffffff, shininess: 100 })  // hinten - cyan
        ];

        this.mesh = new THREE.Mesh(playerGeometry, playerMaterials);
        this.mesh.position.y = 0.5; // Starte auf dem Boden unten
        this.mesh.castShadow = true; // Cast shadows
        this.mesh.receiveShadow = true; // Receive shadows

        // Eigenschaften für die Rollbewegung
        this.mesh.userData.rotationAxis = new THREE.Vector3(0, 0, 1); // Z-Achse für Rotation
        this.mesh.userData.rotationSpeed = 0; // Aktuelle Rotationsgeschwindigkeit

        // Add a point light to the player for a glowing effect
        const playerLight = new THREE.PointLight(0x9966FF, 1, 3);
        playerLight.position.set(0, 0, 0);
        this.mesh.add(playerLight);

        sceneManager.addToScene(this.mesh);
    }

    setupMovement() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isJumping = false;
        this.jumpStartTime = 0;
        this.rotationVelocity = 0; // For jump rotation animation
        this.lastTrailTime = 0; // For trail effect timing
    }

    jump() {
        if (game.playerCanJump && !this.isJumping) {
            this.velocity.y = game.jumpForce;
            this.isJumping = true;
            game.playerCanJump = false;
            this.jumpStartTime = Date.now();
            this.rotationVelocity = 0.15; // Start rotation on jump
        }
    }

    update(deltaTime) {
        // Apply gravity
        if (this.isJumping) {
            this.velocity.y -= 0.01; // Gravity
            this.mesh.position.y += this.velocity.y;

            // Rotate player during jump
            if (this.rotationVelocity > 0) {
                this.mesh.rotation.z += this.rotationVelocity;
                this.rotationVelocity *= 0.98; // Slow down rotation
            }

            // Check if landed
            if (this.mesh.position.y <= 0.5) {
                this.mesh.position.y = 0.5;
                this.velocity.y = 0;
                this.isJumping = false;
                game.playerCanJump = true;
                this.rotationVelocity = 0;

                // Create landing dust particles
                if (window.particleSystem) {
                    window.particleSystem.createLandingDust(this.mesh.position);
                }
            }
        }

        // Create trail effect (every 50ms)
        const currentTime = Date.now();
        if (currentTime - this.lastTrailTime > 50) {
            if (window.particleSystem) {
                window.particleSystem.createTrailParticle(this.mesh.position, this.isJumping);
            }
            this.lastTrailTime = currentTime;
        }

        // Idle rotation when on ground (subtle bobbing effect)
        if (!this.isJumping) {
            this.mesh.rotation.x = Math.sin(currentTime * 0.003) * 0.05;
        }

        // Update camera to follow player
        sceneManager.updateCameraTarget(this.mesh);
    }

    getPosition() {
        return this.mesh.position;
    }

    getMesh() {
        return this.mesh;
    }
}

export let player = new Player();