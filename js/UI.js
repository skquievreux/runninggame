// js/UI.js - Score-Anzeige, Game-Over-Screen
import { game } from './Game.js';

export class UIManager {
    constructor() {
        this.scoreDisplay = null;
        this.livesDisplay = null;
        this.gameOverScreen = null;
        this.createUI();
    }

    createUI() {
        this.createScoreDisplay();
        this.createLivesDisplay();
        this.createGameOverScreen();
    }

    createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.top = '20px';
        scoreDisplay.style.left = '20px';
        scoreDisplay.style.color = 'white';
        scoreDisplay.style.fontSize = '24px';
        scoreDisplay.style.fontFamily = 'Arial, sans-serif';
        scoreDisplay.style.fontWeight = 'bold';
        scoreDisplay.style.textShadow = '2px 2px 4px #000000';
        scoreDisplay.style.zIndex = '1000';
        document.body.appendChild(scoreDisplay);
        this.scoreDisplay = scoreDisplay;
    }

    createLivesDisplay() {
        const livesDisplay = document.createElement('div');
        livesDisplay.id = 'lives-display';
        livesDisplay.style.position = 'absolute';
        livesDisplay.style.top = '20px';
        livesDisplay.style.right = '20px';
        livesDisplay.style.color = 'white';
        livesDisplay.style.fontSize = '24px';
        livesDisplay.style.fontFamily = 'Arial, sans-serif';
        livesDisplay.style.fontWeight = 'bold';
        livesDisplay.style.textShadow = '2px 2px 4px #000000';
        livesDisplay.style.zIndex = '1000';
        document.body.appendChild(livesDisplay);
        this.livesDisplay = livesDisplay;
    }

    createGameOverScreen() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.style.position = 'absolute';
        gameOverScreen.style.top = '50%';
        gameOverScreen.style.left = '50%';
        gameOverScreen.style.transform = 'translate(-50%, -50%)';
        gameOverScreen.style.color = 'white';
        gameOverScreen.style.fontSize = '48px';
        gameOverScreen.style.fontFamily = 'Arial, sans-serif';
        gameOverScreen.style.fontWeight = 'bold';
        gameOverScreen.style.textAlign = 'center';
        gameOverScreen.style.textShadow = '4px 4px 8px #000000';
        gameOverScreen.style.zIndex = '2000';
        gameOverScreen.style.display = 'none';
        gameOverScreen.innerHTML = `
            <div>Game Over</div>
            <div style="font-size: 24px; margin-top: 20px;">Score: <span id="final-score">0</span></div>
            <div style="font-size: 18px; margin-top: 20px;">Press R to Restart</div>
        `;
        document.body.appendChild(gameOverScreen);
        this.gameOverScreen = gameOverScreen;
    }

    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = `Score: ${game.score}`;
        }
    }

    updateLivesDisplay() {
        if (this.livesDisplay) {
            this.livesDisplay.textContent = `Lives: ${game.lives}`;
        }
    }

    showGameOver() {
        if (this.gameOverScreen) {
            const finalScoreElement = this.gameOverScreen.querySelector('#final-score');
            if (finalScoreElement) {
                finalScoreElement.textContent = game.score;
            }
            this.gameOverScreen.style.display = 'block';
        }
    }

    hideGameOver() {
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
    }

    displayScorePopUp(position, score) {
        const scorePopUp = document.createElement('div');
        scorePopUp.style.position = 'absolute';
        scorePopUp.style.left = `${position.x}px`;
        scorePopUp.style.top = `${position.y}px`;
        scorePopUp.style.color = 'white';
        scorePopUp.style.fontSize = '18px';
        scorePopUp.style.fontFamily = 'Arial, sans-serif';
        scorePopUp.style.textShadow = '2px 2px 4px #000000';
        scorePopUp.textContent = `+${score}`;
        document.body.appendChild(scorePopUp);

        // Animate the pop-up
        setTimeout(() => {
            scorePopUp.style.transition = 'all 0.5s ease-out';
            scorePopUp.style.top = `${position.y - 20}px`;
            scorePopUp.style.opacity = '0';

            // Remove the pop-up after the animation
            setTimeout(() => {
                if (scorePopUp.parentNode) {
                    document.body.removeChild(scorePopUp);
                }
            }, 500);
        }, 10);
    }

    update() {
        this.updateScoreDisplay();
        this.updateLivesDisplay();

        if (game.isGameOver) {
            this.showGameOver();
        } else {
            this.hideGameOver();
        }
    }
}

export let uiManager = new UIManager();