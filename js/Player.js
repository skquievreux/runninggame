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
    }

    jump() {
        if (game.playerCanJump && !this.isJumping) {
            this.velocity.y = game.jumpForce;
            this.isJumping = true;
            game.playerCanJump = false;
            this.jumpStartTime = Date.now();
        }
    }

    update(deltaTime) {
        // Apply gravity
        if (this.isJumping) {
            this.velocity.y -= 0.01; // Gravity
            this.mesh.position.y += this.velocity.y;

            // Check if landed
            if (this.mesh.position.y <= 0.5) {
                this.mesh.position.y = 0.5;
                this.velocity.y = 0;
                this.isJumping = false;
                game.playerCanJump = true;
            }
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