// js/Utils.js - Hilfsfunktionen
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Utility functions
export function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

export function distance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) +
        Math.pow(pos2.y - pos1.y, 2) +
        Math.pow(pos2.z - pos1.z, 2)
    );
}

export function createVector3(x = 0, y = 0, z = 0) {
    return new THREE.Vector3(x, y, z);
}

export function createColor(hex) {
    return new THREE.Color(hex);
}

// Input handling utilities
export class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, buttons: {} };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        // Mouse events
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });

        window.addEventListener('mousedown', (event) => {
            this.mouse.buttons[event.button] = true;
        });

        window.addEventListener('mouseup', (event) => {
            this.mouse.buttons[event.button] = false;
        });

        // Touch events for mobile
        window.addEventListener('touchstart', (event) => {
            // Handle touch as mouse click
            this.mouse.buttons[0] = true;
        });

        window.addEventListener('touchend', (event) => {
            this.mouse.buttons[0] = false;
        });
    }

    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    isMouseButtonPressed(button) {
        return !!this.mouse.buttons[button];
    }

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
}

export let inputManager = new InputManager();