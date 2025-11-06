// js/Coins.js - Coin collection system
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

export class CoinManager {
    constructor() {
        this.coins = [];
        this.coinSpawnInterval = 2000; // ms
        this.lastCoinSpawnTime = 0;
    }

    spawnCoin() {
        const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const coinMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700, // Gold
            emissive: 0xFFAA00,
            emissiveIntensity: 0.5,
            shininess: 100,
            specular: 0xFFFFFF
        });

        const coin = new THREE.Mesh(coinGeometry, coinMaterial);

        // Random position: on ground or floating
        const yPosition = Math.random() > 0.5 ? 0.5 : 1.5; // Ground or floating
        const xOffset = (Math.random() - 0.5) * 2; // -1 to 1

        coin.position.set(xOffset, yPosition, -20); // Spawn far away
        coin.rotation.x = Math.PI / 2; // Stand upright
        coin.castShadow = true;

        // Add glow light
        const coinLight = new THREE.PointLight(0xFFD700, 0.5, 3);
        coinLight.position.set(0, 0, 0);
        coin.add(coinLight);

        sceneManager.addToScene(coin);

        this.coins.push({
            mesh: coin,
            rotationSpeed: 0.05 + Math.random() * 0.05, // Random rotation speed
            floatOffset: Math.random() * Math.PI * 2, // Random float phase
            collected: false
        });
    }

    update(deltaTime) {
        const currentTime = Date.now();

        // Spawn new coins
        if (currentTime - this.lastCoinSpawnTime > this.coinSpawnInterval && !game.isGameOver) {
            this.spawnCoin();
            this.lastCoinSpawnTime = currentTime;
        }

        // Update existing coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];

            if (!coin.collected) {
                // Move coin towards player
                coin.mesh.position.z += game.speed;

                // Magnet effect - pull coins towards player
                if (game.hasMagnet && window.player) {
                    const playerPos = window.player.getPosition();
                    const direction = new THREE.Vector3();
                    direction.subVectors(playerPos, coin.mesh.position);
                    direction.normalize();
                    direction.multiplyScalar(0.1); // Magnet strength

                    coin.mesh.position.add(direction);
                }

                // Rotate coin
                coin.mesh.rotation.z += coin.rotationSpeed;

                // Floating animation
                const floatAmount = Math.sin(Date.now() * 0.003 + coin.floatOffset) * 0.1;
                coin.mesh.position.y += floatAmount * 0.05;

                // Remove if passed player
                if (coin.mesh.position.z > 5) {
                    sceneManager.removeFromScene(coin.mesh);
                    coin.mesh.geometry.dispose();
                    coin.mesh.material.dispose();
                    this.coins.splice(i, 1);
                }
            }
        }
    }

    checkCollisions(playerMesh) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];

            if (!coin.collected) {
                const distance = playerMesh.position.distanceTo(coin.mesh.position);

                // Collection radius
                if (distance < 0.8) {
                    this.collectCoin(coin, i);
                }
            }
        }
    }

    collectCoin(coin, index) {
        coin.collected = true;

        // Add score
        game.updateScore(10);

        // Create collection effect
        if (window.particleSystem) {
            window.particleSystem.createCoinCollectionEffect(coin.mesh.position);
        }

        // Remove coin
        sceneManager.removeFromScene(coin.mesh);
        coin.mesh.geometry.dispose();
        coin.mesh.material.dispose();
        this.coins.splice(index, 1);
    }

    clear() {
        // Remove all coins from scene
        for (let coin of this.coins) {
            sceneManager.removeFromScene(coin.mesh);
            coin.mesh.geometry.dispose();
            coin.mesh.material.dispose();
        }
        this.coins = [];
        this.lastCoinSpawnTime = 0;
    }
}

export let coinManager = new CoinManager();
