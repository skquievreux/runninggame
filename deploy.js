#!/usr/bin/env node

/**
 * Deployment Script für Endless Runner Game
 * Führt automatische Tests und Deployment durch
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process for Endless Runner Game...\n');

// Schritt 1: Lokaler Build-Test
console.log('📦 Step 1: Testing local build...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build test passed\n');
} catch (error) {
    console.error('❌ Build test failed:', error.message);
    process.exit(1);
}

// Schritt 2: Lokaler Server-Test
console.log('🌐 Step 2: Testing local server...');
const serverProcess = require('child_process').spawn('python', ['-m', 'http.server', '8000'], {
    detached: true,
    stdio: 'ignore'
});

// Warte kurz für Server-Start
setTimeout(() => {
    try {
        // Einfacher HTTP-Request-Test
        execSync('curl -f http://localhost:8000/index.html', { stdio: 'pipe' });
        console.log('✅ Local server test passed\n');
    } catch (error) {
        console.error('❌ Local server test failed');
        process.exit(1);
    } finally {
        // Server stoppen
        process.kill(-serverProcess.pid);
    }

    // Schritt 3: Git-Status prüfen
    console.log('📋 Step 3: Checking git status...');
    try {
        const gitStatus = execSync('git status --porcelain').toString();
        if (gitStatus.trim()) {
            console.log('⚠️  Uncommitted changes found:');
            console.log(gitStatus);
            console.log('Please commit your changes before deploying.\n');
            process.exit(1);
        }
        console.log('✅ Git status clean\n');
    } catch (error) {
        console.error('❌ Git status check failed:', error.message);
        process.exit(1);
    }

    // Schritt 4: Deployment auf Vercel
    console.log('🚀 Step 4: Deploying to Vercel...');
    try {
        execSync('npm run deploy', { stdio: 'inherit' });
        console.log('✅ Deployment successful!\n');
        console.log('🎉 Your Endless Runner Game is now live on Vercel!');
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}, 2000);