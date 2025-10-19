// script.js

// Game variables
let isGameOver = false;
let score = 0;
let lives = 5; // 5 Leben für den Spieler
let speed = 0.2;
let jumpForce = 0.2;
let playerCanJump = true;
let obstacles = [];
let ground = [];
let clouds = [];
let particles = [];
let groundWidth = 20;
let groundSegments = 10;
let obstacleSpawnInterval = 1500; // ms
let lastObstacleTime = 0;
let gameStarted = true; // Automatisch starten
let passedObstacles = []; // Array für übersprungene Hindernisse

// Particle system for effects
function createExplosion(position, color) {
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
    scene.add(particleSystem);
    
    // Add to particles array with lifetime
    particles.push({
        system: particleSystem,
        velocities: particleVelocities,
        life: 1.0, // 1 second lifetime
        positions: particlePositions
    });
    
    return particleSystem;
}

// Update particles
function updateParticles(deltaTime) {
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
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
            scene.remove(particle.system);
            particles.splice(i, 1);
            i--;
        }
    }
}

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create background with sky at the bottom
function createBackground() {
    // Sky gradient - now at the bottom
    const skyGeometry = new THREE.PlaneGeometry(2000, 1000); // Vergrößert für vollständige Abdeckung
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            bottomColor: { value: new THREE.Color(0x0077FF) },  // Blauer Himmel unten
            topColor: { value: new THREE.Color(0xADD8E6) } // Hellerer Himmel oben
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
            }
        `,
        side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.z = -100;
    sky.position.y = -100; // Himmel ist jetzt unten
    scene.add(sky);
    
    // Create mountains
    const mountainGeometry = new THREE.BufferGeometry();
    const mountainPoints = [];
    
    // Create jagged mountain silhouette
    mountainPoints.push(new THREE.Vector3(-100, -10, -50));
    
    // Generate random mountain peaks
    for (let i = -100; i <= 100; i += 10) {
        const height = Math.random() * 15 + 5;
        mountainPoints.push(new THREE.Vector3(i, height, -50));
    }
    
    mountainPoints.push(new THREE.Vector3(100, -10, -50));
    
    // Create mountain shape
    const mountainShape = new THREE.Shape();
    mountainShape.moveTo(mountainPoints[0].x, mountainPoints[0].y);
    
    for (let i = 1; i < mountainPoints.length; i++) {
        mountainShape.lineTo(mountainPoints[i].x, mountainPoints[i].y);
    }
    
    const mountainGeom = new THREE.ShapeGeometry(mountainShape);
    const mountainMaterial = new THREE.MeshLambertMaterial({
        color: 0x4B6455,  // Dunkelgrün/Grau für Berge
        side: THREE.DoubleSide
    });
    
    const mountains = new THREE.Mesh(mountainGeom, mountainMaterial);
    mountains.position.y = 0;
    scene.add(mountains);
    
    // Create clouds
    for (let i = 0; i < 20; i++) {
        const cloudGeometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        
        // Random position
        cloud.position.x = Math.random() * 200 - 100;
        cloud.position.y = Math.random() * 20 + 20;
        cloud.position.z = -40 - Math.random() * 10;
        
        // Flatten the cloud
        cloud.scale.y = 0.5;
        cloud.scale.x = Math.random() * 1 + 1;
        
        scene.add(cloud);
        
        // Add to an array for animation
        clouds.push(cloud);
    }
}

// Set sky color (fallback)
renderer.setClearColor(0x87CEEB);

// Create enhanced lighting system
// Softer ambient light
const ambientLight = new THREE.AmbientLight(0x666666, 0.5);
scene.add(ambientLight);

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
scene.add(directionalLight);

// Add a secondary light for more depth
const secondaryLight = new THREE.DirectionalLight(0x6666ff, 0.5);
secondaryLight.position.set(-10, 15, -10);
scene.add(secondaryLight);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

const player = new THREE.Mesh(playerGeometry, playerMaterials);
player.position.y = 0.5; // Starte auf dem Boden unten
player.castShadow = true; // Cast shadows
player.receiveShadow = true; // Receive shadows

// Eigenschaften für die Rollbewegung
player.userData.rotationAxis = new THREE.Vector3(0, 0, 1); // Z-Achse für Rotation
player.userData.rotationSpeed = 0; // Aktuelle Rotationsgeschwindigkeit

// Add a point light to the player for a glowing effect
const playerLight = new THREE.PointLight(0x9966FF, 1, 3);
playerLight.position.set(0, 0, 0);
player.add(playerLight);

scene.add(player);

// Position camera
camera.position.z = 5;
camera.position.y = 2; // Normale Höhe
camera.position.x = -2;
camera.lookAt(player.position);

// Create ground with enhanced visuals
function createGround() {
    // Create a textured ground material
    const textureLoader = new THREE.TextureLoader();
    
    // Create a procedural texture using a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill with base color
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add some noise/texture
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 3 + 1;
        const brightness = Math.random() * 40 - 20;
        
        ctx.fillStyle = `rgb(${128 + brightness}, ${128 + brightness}, ${128 + brightness})`;
        ctx.fillRect(x, y, size, size);
    }
    
    // Add some lines to simulate road markings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();
    
    // Create texture from canvas
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 4);
    
    // Create enhanced material
    const groundMaterial = new THREE.MeshPhongMaterial({
        map: groundTexture,
        shininess: 10,
        specular: 0x333333
    });
    
    // Create ground segments
    for (let i = 0; i < groundSegments; i++) {
  if (Math.random() > 0.2) { // 80% chance to create ground, 20% chance to create a gap
   const groundGeometry = new THREE.BoxGeometry(groundWidth, 0.5, 4);
   const groundPiece = new THREE.Mesh(groundGeometry, groundMaterial);
   groundPiece.position.x = i * groundWidth;
   groundPiece.position.y = -0.25; // Boden ist unten
   groundPiece.receiveShadow = true; // Receive shadows
   scene.add(groundPiece);
   ground.push(groundPiece);
  } else {
   ground.push(null); // Add null to the array to represent a gap
  }
    }
}

// Create visually enhanced obstacles
// Obstacle patterns
const obstaclePatterns = [
    [1, 0, 1], // Short, tall, short
    [0, 1, 0], // Tall, short, tall
    [1, 1, 1], // Short, short, short
    [0, 0, 0]  // Tall, tall, tall
];
function createObstacle() {
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
            obstacle.position.x = ground[ground.length - 1].position.x + i * obstacleSpacing;
            obstacle.position.y = height / 2; // Position auf dem Boden unten
            
            // Add rotation for more visual interest
            obstacle.rotation.y = Math.random() * Math.PI;
            
            // Add shadows
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            
            scene.add(obstacle);
            obstacle.speed = speed * (Math.random() * 0.5 + 0.75); // Random speed between 75% and 125% of game speed
            obstacles.push(obstacle);
   
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

// Create power-up
function createPowerUp() {
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
    powerUp.position.x = ground[ground.length - 1].position.x + Math.random() * 10;
    powerUp.position.y = 0.75; // Position above the ground
    
    powerUp.rotation.y = Math.random() * Math.PI;
    
    powerUp.castShadow = true;
    powerUp.receiveShadow = true;
    
    scene.add(powerUp);
    
    return powerUp;
}

// Check collision
function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// Create collision effect
function createCollisionEffect(position) {
    // Create explosion at collision point
    createExplosion(position, 0xFF0000); // Red explosion
    
    // Add impact flash
    const flashLight = new THREE.PointLight(0xFF0000, 5, 10);
    flashLight.position.copy(position);
    scene.add(flashLight);
    
    // Remove flash after a short time
    setTimeout(() => {
        scene.remove(flashLight);
    }, 200);
}

// Display score pop-up
function displayScorePopUp(position, score) {
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
            document.body.removeChild(scorePopUp);
        }, 500);
    }, 10);
}

// Unlock character
function unlockCharacter() {
    if (score >= 500 && !player.unlockedCharacter1) {
        player.unlockedCharacter1 = true;
        console.log('Character 1 unlocked!');
        // Display a message to the player
    }
}

// Create score display
function createScoreDisplay() {
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

    updateScoreDisplay();
}

// Update score display
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    const livesDisplay = document.getElementById('lives-display');

    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    if (livesDisplay) {
        livesDisplay.textContent = `Lives: ${lives}`;
    }
}

// Game over function
function gameOver() {
    isGameOver = true;

    // Create game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.style.position = 'fixed';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.zIndex = '2000';

    const gameOverText = document.createElement('h1');
    gameOverText.textContent = 'Game Over';
    gameOverText.style.color = 'white';
    gameOverText.style.fontSize = '48px';
    gameOverText.style.fontFamily = 'Arial, sans-serif';
    gameOverText.style.marginBottom = '20px';

    const finalScoreText = document.createElement('p');
    finalScoreText.textContent = `Final Score: ${score}`;
    finalScoreText.style.color = 'white';
    finalScoreText.style.fontSize = '24px';
    finalScoreText.style.fontFamily = 'Arial, sans-serif';
    finalScoreText.style.marginBottom = '40px';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.padding = '15px 30px';
    restartButton.style.fontSize = '18px';
    restartButton.style.fontFamily = 'Arial, sans-serif';
    restartButton.style.backgroundColor = '#4CAF50';
    restartButton.style.color = 'white';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = restartGame;

    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(finalScoreText);
    gameOverScreen.appendChild(restartButton);
    document.body.appendChild(gameOverScreen);
}

// Restart game function
function restartGame() {
    // Remove game over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
        document.body.removeChild(gameOverScreen);
    }

    // Reset game variables
    isGameOver = false;
    score = 0;
    lives = 5;
    speed = 0.2;
    playerCanJump = true;
    obstacles = [];
    ground = [];
    clouds = [];
    particles = [];
    passedObstacles = [];

    // Clear scene
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }

    // Reinitialize game
    createGround();
    createBackground();
    createScoreDisplay();

    // Reset player position
    player.position.y = 0.5;
    player.position.x = 0;
    velocity = 0;

    // Restart animation
    animate();
}
}

// Animation variables
let gravity = -0.01; // Normale Schwerkraft - negativ
let velocity = 0;
let clock = new THREE.Clock();
let deltaTime = 0;

// Initialize game
createGround();
createBackground();
createScoreDisplay();
// Startbildschirm überspringen

// Animation loop
function animate() {
    if (isGameOver) return;
    
    requestAnimationFrame(animate);
    
    // Get delta time for smooth animation
    deltaTime = clock.getDelta();
    
    // Update particles
    updateParticles(deltaTime);
 
  // Unlock characters
  if (score > 0 && score % 250 === 0) {
   unlockCharacter();
  }
    
    if (gameStarted) {
  // Power-ups
  if (Math.random() < 0.005) { // 0.5% chance to spawn a power-up
   const powerUp = createPowerUp();
   obstacles.push(powerUp); // Reuse the obstacles array for power-ups as well
  }
        // Score wird jetzt nur noch für übersprungene Hindernisse erhöht
        
        // Increase speed over time
        speed = 0.2 + (score / 1000);
        
        // Move ground
        for (let i = 0; i < ground.length; i++) {
   if (ground[i]) {
    ground[i].position.x -= speed;
    
    // If ground piece is out of view, move it to the end
    if (ground[i].position.x < -groundWidth) {
     ground[i].position.x = (ground.length - 1) * groundWidth;
    }
   }
        }
        
        // Move clouds
        for (let i = 0; i < clouds.length; i++) {
            // Clouds move at different speeds for parallax effect
            clouds[i].position.x -= speed * 0.2;
            
            // If cloud is out of view, move it to the end
            if (clouds[i].position.x < -100) {
                clouds[i].position.x = 100;
                clouds[i].position.y = Math.random() * 20 + 20;
            }
        }
        
        // Spawn obstacles
        const currentTime = Date.now();
        if (currentTime - lastObstacleTime > obstacleSpawnInterval) {
            createObstacle();
            lastObstacleTime = currentTime;
            
            // Decrease spawn interval over time (make game harder)
            obstacleSpawnInterval = Math.max(800, 1500 - score / 10);
        }
        
        // Move obstacles
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].position.x -= obstacles[i].speed;
   
   // Move obstacles vertically
   if (obstacles[i].verticalSpeed !== 0) {
    obstacles[i].position.y += obstacles[i].verticalSpeed * obstacles[i].verticalDirection;
    
    // Change direction if obstacle reaches top or bottom
    if (obstacles[i].position.y > 2 || obstacles[i].position.y < 0.5) {
     obstacles[i].verticalDirection *= -1;
    }
   }
            
            // Check collision
            if (checkCollision(player, obstacles[i]) && !obstacles[i].hit) {
                obstacles[i].hit = true; // Markiere das Hindernis als getroffen
                
                // Leben abziehen
                lives--;
                updateLivesDisplay();
                
                // Kollisionseffekt anzeigen
                createCollisionEffect(player.position);
                
                // Game Over, wenn keine Leben mehr übrig sind
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            }
            
            // Überprüfen, ob ein Hindernis übersprungen wurde
            if (!obstacles[i].passed &&
                !obstacles[i].hit &&
                obstacles[i].position.x < player.position.x - 1) {
                obstacles[i].passed = true; // Markiere das Hindernis als übersprungen
                passedObstacles.push(obstacles[i]);
                
                // Punkte für übersprungenes Hindernis
                score += 10;
                updateScoreDisplay();
    displayScorePopUp({x: renderer.domElement.offsetLeft + obstacles[i].position.x * 50, y: renderer.domElement.offsetTop + obstacles[i].position.y * 50}, 10);
                
                // Visuellen Effekt für übersprungenes Hindernis anzeigen
                createExplosion(obstacles[i].position, 0x00FF00); // Grüne Explosion
            }
   
            // Remove obstacles that are out of view
            if (obstacles[i].position.x < -20) {
                scene.remove(obstacles[i]);
                obstacles.splice(i, 1);
                i--;
            }
   }
        
        // Check power-up collision
        for (let i = 0; i < obstacles.length; i++) {
         if (obstacles[i] !== null && obstacles[i].geometry instanceof THREE.CylinderGeometry) { // Check if it's a power-up
          if (checkCollision(player, obstacles[i])) {
           scene.remove(obstacles[i]);
           obstacles.splice(i, 1);
           i--;
          
          // Apply power-up effect (e.g., increase score multiplier)
          score += 50;
          updateScoreDisplay();
    displayScorePopUp({x: renderer.domElement.offsetLeft + obstacles[i].position.x * 50, y: renderer.domElement.offsetTop + obstacles[i].position.y * 50}, 50);
          console.log('Power-up collected!');
         }
        }
        
        // Apply gravity to player
        velocity += gravity;
        player.position.y += velocity;
        
        // Ground check - normaler Boden unten
        if (player.position.y < 0.5) { // 0.5 ist die Position des "Bodens"
            player.position.y = 0.5;
            velocity = 0;
            playerCanJump = true;
        }
        
        // Würfel-Rotation basierend auf Bewegung
        if (playerCanJump) {
            // Rollgeschwindigkeit basierend auf Spielgeschwindigkeit
            player.userData.rotationSpeed = speed * 2;
            
            // Würfel um X-Achse rotieren (rollen)
            player.rotation.x -= player.userData.rotationSpeed;
        } else {
            // In der Luft langsamer rotieren
            player.rotation.x -= player.userData.rotationSpeed * 0.5;
        }
    }
    
    // Rotate player slightly based on velocity
    player.rotation.z = -velocity * 2;
    
    renderer.render(scene, camera);
}

animate();

animate();