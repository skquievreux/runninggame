// js/Obstacles.js - Hindernisse und Power-ups
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

// Obstacle patterns
const obstaclePatterns = [
    [1, 0, 1], // Short, tall, short
    [0, 1, 0], // Tall, short, tall
    [1, 1, 1], // Short, short, short
    [0, 0, 0]  // Tall, tall, tall
];

export class ObstacleManager {
    constructor() {
        this.lastSpawnTime = 0;
    }

    createObstacle() {
        const pattern = obstaclePatterns[Math.floor(Math.random() * obstaclePatterns.length)];
        const obstacleSpacing = 3; // Abstand zwischen Hindernissen im Muster

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === 1) {
                // Lower height range - max height 1.0 instead of 2
                const height = Math.random() * 0.5 + 0.5; // Random height between 0.5 and 1.0

                // Randomly choose obstacle type
                const obstacleType = Math.floor(Math.random() * 3);
                let obstacleGeometry;

                switch(obstacleType) {
                    case 0: // Box
                        obstacleGeometry = new THREE.BoxGeometry(1, height, 2);
                    break;
                    case 1: // Cylinder
                        obstacleGeometry = new THREE.CylinderGeometry(0.5, 0.5, height, 8);
                    break;
                    case 2: // Cone
                        obstacleGeometry = new THREE.ConeGeometry(0.7, height, 8);
                    break;
                }

                // Create shiny material with glow
                const obstacleMaterial = new THREE.MeshPhongMaterial({
                    color: 0xFF0000,
                    specular: 0xFFFFFF,
                    shininess: 100,
                    emissive: 0x660000,
                    emissiveIntensity: 0.5
                });

                const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

                // Position at the far end of visible ground
                const lastGroundPiece = game.ground[game.ground.length - 1];
                if (lastGroundPiece) {
                    obstacle.position.x = lastGroundPiece.position.x + i * obstacleSpacing;
                } else {
                    obstacle.position.x = i * obstacleSpacing;
                }
                obstacle.position.y = height / 2; // Position auf dem Boden unten

                // Add rotation for more visual interest
                obstacle.rotation.y = Math.random() * Math.PI;

                // Add shadows
                obstacle.castShadow = true;
                obstacle.receiveShadow = true;

                sceneManager.addToScene(obstacle);
                obstacle.speed = game.speed * (Math.random() * 0.5 + 0.75); // Random speed between 75% and 125% of game speed
                game.obstacles.push(obstacle);

                // Add vertical movement to some obstacles
                if (Math.random() < 0.3) {
                    obstacle.verticalSpeed = Math.random() * 0.05 - 0.025; // Random speed between -0.025 and 0.025
                    obstacle.verticalDirection = 1; // 1 = up, -1 = down
                } else {
                    obstacle.verticalSpeed = 0;
                }
            }
        }
    }

    createPowerUp() {
        const powerUpGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
        const powerUpMaterial = new THREE.MeshPhongMaterial({
            color: 0x00FF00,
            specular: 0xFFFFFF,
            shininess: 100,
            emissive: 0x006600,
            emissiveIntensity: 0.5
        });

        const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);

        // Position at the far end of visible ground
        const lastGroundPiece = game.ground[game.ground.length - 1];
        if (lastGroundPiece) {
            powerUp.position.x = lastGroundPiece.position.x + Math.random() * 10;
        } else {
            powerUp.position.x = Math.random() * 10;
        }
        powerUp.position.y = 0.75; // Position above the ground

        powerUp.rotation.y = Math.random() * Math.PI;

        powerUp.castShadow = true;
        powerUp.receiveShadow = true;

        sceneManager.addToScene(powerUp);

        return powerUp;
    }

    update(deltaTime) {
        // Update obstacle positions
        game.obstacles.forEach((obstacle, index) => {
            if (obstacle) {
                obstacle.position.x -= obstacle.speed;

                // Update vertical movement
                if (obstacle.verticalSpeed !== 0) {
                    obstacle.position.y += obstacle.verticalSpeed;

                    // Reverse direction at boundaries
                    if (obstacle.position.y > 2 || obstacle.position.y < 0.5) {
                        obstacle.verticalSpeed *= -1;
                    }
                }

                // Remove obstacles that are off screen
                if (obstacle.position.x < -50) {
                    sceneManager.removeFromScene(obstacle);
                    game.obstacles.splice(index, 1);
                }
            }
        });

        // Spawn new obstacles
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime > game.obstacleSpawnInterval) {
            this.createObstacle();
            this.lastSpawnTime = currentTime;
        }
    }

    checkCollisions(playerMesh) {
        // Check obstacle collisions
        game.obstacles.forEach((obstacle, index) => {
            if (obstacle && this.checkCollision(playerMesh, obstacle)) {
                // Check if player has shield
                if (game.hasShield) {
                    // Shield absorbs hit - just remove obstacle
                    if (window.particleSystem) {
                        window.particleSystem.createExplosion(obstacle.position, 0x00FFFF);
                    }
                } else {
                    // Normal collision - lose life
                    game.loseLife();
                    if (window.particleSystem) {
                        window.particleSystem.createCollisionEffect(obstacle.position);
                    }
                }

                sceneManager.removeFromScene(obstacle);
                game.obstacles.splice(index, 1);
            }
        });
    }

    checkCollision(obj1, obj2) {
        const box1 = new THREE.Box3().setFromObject(obj1);
        const box2 = new THREE.Box3().setFromObject(obj2);
        return box1.intersectsBox(box2);
    }
}

export let obstacleManager = new ObstacleManager();