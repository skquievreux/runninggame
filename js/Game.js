// js/Game.js - Hauptspiel-Logik und Variablen
export class Game {
    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.lives = 5;
        this.speed = 0.2;
        this.jumpForce = 0.2;
        this.playerCanJump = true;
        this.obstacles = [];
        this.ground = [];
        this.clouds = [];
        this.particles = [];
        this.groundWidth = 20;
        this.groundSegments = 10;
        this.obstacleSpawnInterval = 1500; // ms
        this.lastObstacleTime = 0;
        this.gameStarted = true;
        this.passedObstacles = [];

        // Power-up flags
        this.hasShield = false;
        this.hasMagnet = false;
    }

    updateScore(points) {
        this.score += points;
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        // Game Over Logik hier
    }

    restart() {
        this.isGameOver = false;
        this.score = 0;
        this.lives = 5;
        this.speed = 0.2;
        this.playerCanJump = true;
        this.obstacles = [];
        this.ground = [];
        this.clouds = [];
        this.particles = [];
        this.lastObstacleTime = 0;
        this.passedObstacles = [];
    }

    unlockCharacter() {
        if (this.score >= 500 && !this.player?.unlockedCharacter1) {
            this.player.unlockedCharacter1 = true;
            console.log('Character 1 unlocked!');
            // Display a message to the player
        }
    }
}

export let game = new Game();