// js/Scene.js - Szene, Kamera, Renderer, Beleuchtung
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.initRenderer();
        this.setupLighting();
        this.setupCamera();
    }

    initRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Set sky color (fallback)
        this.renderer.setClearColor(0x87CEEB);

        // Enable shadows in the renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLighting() {
        // Softer ambient light
        const ambientLight = new THREE.AmbientLight(0x666666, 0.5);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffcc, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);

        // Add a secondary light for more depth
        const secondaryLight = new THREE.DirectionalLight(0x6666ff, 0.5);
        secondaryLight.position.set(-10, 15, -10);
        this.scene.add(secondaryLight);
    }

    setupCamera() {
        // Position camera
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.position.x = -2;
    }

    addToScene(object) {
        this.scene.add(object);
    }

    removeFromScene(object) {
        this.scene.remove(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    updateCameraTarget(target) {
        this.camera.lookAt(target.position);
    }
}

export let sceneManager = new SceneManager();