// js/Particles.js - Partikelsystem
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { sceneManager } from './Scene.js';
import { game } from './Game.js';

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(position, color) {
        const particleCount = 30;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Start at explosion position
            particlePositions[i * 3] = position.x;
            particlePositions[i * 3 + 1] = position.y;
            particlePositions[i * 3 + 2] = position.z;

            // Random velocity in all directions
            particleVelocities.push({
                x: (Math.random() - 0.5) * 0.3,
                y: Math.random() * 0.2 + 0.1,
                z: (Math.random() - 0.5) * 0.3
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: color || 0xFF5500,
            size: 0.2,
            transparent: true,
            opacity: 1
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        sceneManager.addToScene(particleSystem);

        // Add to particles array with lifetime
        this.particles.push({
            system: particleSystem,
            velocities: particleVelocities,
            life: 1.0, // 1 second lifetime
            positions: particlePositions
        });

        return particleSystem;
    }

    updateParticles(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // Update life
            particle.life -= deltaTime;

            // Update positions based on velocities
            for (let j = 0; j < particle.velocities.length; j++) {
                particle.positions[j * 3] += particle.velocities[j].x;
                particle.positions[j * 3 + 1] += particle.velocities[j].y;
                particle.positions[j * 3 + 2] += particle.velocities[j].z;

                // Add gravity
                particle.velocities[j].y -= 0.01;
            }

            // Update buffer attribute
            particle.system.geometry.attributes.position.needsUpdate = true;

            // Fade out
            particle.system.material.opacity = particle.life;

            // Remove if expired
            if (particle.life <= 0) {
                sceneManager.removeFromScene(particle.system);
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    createCollisionEffect(position) {
        // Create explosion at collision point
        this.createExplosion(position, 0xFF0000); // Red explosion

        // Add impact flash
        const flashLight = new THREE.PointLight(0xFF0000, 5, 10);
        flashLight.position.copy(position);
        sceneManager.addToScene(flashLight);

        // Remove flash after a short time
        setTimeout(() => {
            sceneManager.removeFromScene(flashLight);
        }, 200);
    }
}

export let particleSystem = new ParticleSystem();