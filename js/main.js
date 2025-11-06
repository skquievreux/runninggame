// js/main.js - Haupt-Einstiegspunkt für das Spiel
import { game } from './Game.js';
import { sceneManager } from './Scene.js';
import { player } from './Player.js';
import { environment } from './Environment.js';
import { obstacleManager } from './Obstacles.js';
import { particleSystem } from './Particles.js';
import { coinManager } from './Coins.js';
import { uiManager } from './UI.js';
import { inputManager } from './Utils.js';

// Game loop variables
let lastTime = 0;
let animationId;

// Initialize the game
function init() {
    // All initialization is done in the constructors of the imported modules
    console.log('Game initialized');

    // Make particleSystem globally accessible for Player.js
    window.particleSystem = particleSystem;

    // Start the game loop
    animate(0);
}

// Game loop
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    // Update game logic
    update(deltaTime);

    // Render the scene
    sceneManager.render();

    // Continue the loop
    animationId = requestAnimationFrame(animate);
}

// Update function called every frame
function update(deltaTime) {
    // Handle input
    handleInput();

    // Update player
    player.update(deltaTime);

    // Update obstacles
    obstacleManager.update(deltaTime);

    // Update coins
    coinManager.update(deltaTime);

    // Check collisions
    obstacleManager.checkCollisions(player.getMesh());
    coinManager.checkCollisions(player.getMesh());

    // Update particles
    particleSystem.updateParticles(deltaTime);
    particleSystem.updateTrailParticles(deltaTime);

    // Update environment (clouds)
    environment.updateClouds();

    // Update UI
    uiManager.update();

    // Update game state
    game.unlockCharacter();
}

// Handle user input
function handleInput() {
    // Space bar or mouse click to jump
    if (inputManager.isKeyPressed('Space') || inputManager.isMouseButtonPressed(0)) {
        player.jump();
    }

    // R key to restart
    if (inputManager.isKeyPressed('KeyR') && game.isGameOver) {
        restartGame();
    }
}

// Restart the game
function restartGame() {
    // Cancel current animation frame
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Reset game state
    game.restart();

    // Reinitialize everything
    init();
}

// Start the game when the page loads
window.addEventListener('load', init);

// Handle window resize
window.addEventListener('resize', () => {
    sceneManager.camera.aspect = window.innerWidth / window.innerHeight;
    sceneManager.camera.updateProjectionMatrix();
    sceneManager.renderer.setSize(window.innerWidth, window.innerHeight);
});