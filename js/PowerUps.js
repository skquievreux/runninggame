// js/PowerUps.js - Power-up system
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

export class PowerUpManager {
    constructor() {
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpSpawnInterval = 8000; // 8 seconds
        this.lastPowerUpSpawnTime = 0;

        this.powerUpTypes = [
            {
                name: 'shield',
                color: 0x00FFFF,
                duration: 5000,
                icon: '🛡️'
            },
            {
                name: 'magnet',
                color: 0xFF00FF,
                duration: 7000,
                icon: '🧲'
            },
            {
                name: 'slowmo',
                color: 0xFFFF00,
                duration: 4000,
                icon: '⏱️'
            }
        ];
    }

    spawnPowerUp() {
        const type = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];

        // Create power-up as rotating torus
        const geometry = new THREE.TorusGeometry(0.4, 0.15, 16, 32);
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.5,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });

        const powerUp = new THREE.Mesh(geometry, material);

        const yPosition = 1.5; // Floating height
        const xOffset = (Math.random() - 0.5) * 2;

        powerUp.position.set(xOffset, yPosition, -20);
        powerUp.rotation.x = Math.PI / 2;

        // Add glow
        const light = new THREE.PointLight(type.color, 1, 4);
        light.position.set(0, 0, 0);
        powerUp.add(light);

        sceneManager.addToScene(powerUp);

        this.powerUps.push({
            mesh: powerUp,
            type: type,
            rotationSpeed: 0.03,
            bobPhase: Math.random() * Math.PI * 2,
            collected: false
        });
    }

    update(deltaTime) {
        const currentTime = Date.now();

        // Spawn new power-ups
        if (currentTime - this.lastPowerUpSpawnTime > this.powerUpSpawnInterval && !game.isGameOver) {
            this.spawnPowerUp();
            this.lastPowerUpSpawnTime = currentTime;
        }

        // Update power-up positions and animations
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];

            if (!powerUp.collected) {
                // Move towards player
                powerUp.mesh.position.z += game.speed;

                // Rotate
                powerUp.mesh.rotation.z += powerUp.rotationSpeed;

                // Bob up and down
                const bobAmount = Math.sin(Date.now() * 0.003 + powerUp.bobPhase) * 0.15;
                powerUp.mesh.position.y = 1.5 + bobAmount;

                // Remove if passed
                if (powerUp.mesh.position.z > 5) {
                    sceneManager.removeFromScene(powerUp.mesh);
                    powerUp.mesh.geometry.dispose();
                    powerUp.mesh.material.dispose();
                    this.powerUps.splice(i, 1);
                }
            }
        }

        // Update active power-ups (remove expired ones)
        for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
            const activePowerUp = this.activePowerUps[i];
            if (currentTime > activePowerUp.expiresAt) {
                this.deactivatePowerUp(activePowerUp);
                this.activePowerUps.splice(i, 1);
            }
        }
    }

    checkCollisions(playerMesh) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];

            if (!powerUp.collected) {
                const distance = playerMesh.position.distanceTo(powerUp.mesh.position);

                if (distance < 0.9) {
                    this.collectPowerUp(powerUp, i, playerMesh);
                }
            }
        }
    }

    collectPowerUp(powerUp, index, playerMesh) {
        powerUp.collected = true;

        // Activate power-up
        this.activatePowerUp(powerUp.type, playerMesh);

        // Create collection effect
        if (window.particleSystem) {
            window.particleSystem.createPowerUpCollectionEffect(powerUp.mesh.position, powerUp.type.color);
        }

        // Remove from scene
        sceneManager.removeFromScene(powerUp.mesh);
        powerUp.mesh.geometry.dispose();
        powerUp.mesh.material.dispose();
        this.powerUps.splice(index, 1);
    }

    activatePowerUp(type, playerMesh) {
        const currentTime = Date.now();
        const activePowerUp = {
            type: type,
            expiresAt: currentTime + type.duration
        };

        // Apply power-up effect
        if (type.name === 'shield') {
            this.activateShield(playerMesh);
            activePowerUp.shieldMesh = this.createShieldVisual(playerMesh);
        } else if (type.name === 'magnet') {
            this.activateMagnet();
        } else if (type.name === 'slowmo') {
            this.activateSlowMotion();
            activePowerUp.originalSpeed = game.speed;
        }

        this.activePowerUps.push(activePowerUp);

        // Notify UI
        if (window.uiManager) {
            window.uiManager.showPowerUpNotification(type);
        }
    }

    activateShield(playerMesh) {
        game.hasShield = true;
    }

    createShieldVisual(playerMesh) {
        const shieldGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const shieldMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });

        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        playerMesh.add(shield);
        return shield;
    }

    activateMagnet() {
        game.hasMagnet = true;
    }

    activateSlowMotion() {
        game.speed *= 0.5; // Half speed
    }

    deactivatePowerUp(activePowerUp) {
        const type = activePowerUp.type;

        if (type.name === 'shield') {
            game.hasShield = false;
            if (activePowerUp.shieldMesh) {
                activePowerUp.shieldMesh.parent.remove(activePowerUp.shieldMesh);
                activePowerUp.shieldMesh.geometry.dispose();
                activePowerUp.shieldMesh.material.dispose();
            }
        } else if (type.name === 'magnet') {
            game.hasMagnet = false;
        } else if (type.name === 'slowmo') {
            game.speed = activePowerUp.originalSpeed || 0.2;
        }
    }

    clear() {
        // Clear all power-ups
        for (let powerUp of this.powerUps) {
            sceneManager.removeFromScene(powerUp.mesh);
            powerUp.mesh.geometry.dispose();
            powerUp.mesh.material.dispose();
        }
        this.powerUps = [];

        // Deactivate all active power-ups
        for (let activePowerUp of this.activePowerUps) {
            this.deactivatePowerUp(activePowerUp);
        }
        this.activePowerUps = [];

        this.lastPowerUpSpawnTime = 0;
    }

    isShieldActive() {
        return game.hasShield === true;
    }

    isMagnetActive() {
        return game.hasMagnet === true;
    }
}

export let powerUpManager = new PowerUpManager();
