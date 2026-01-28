import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';

class Game {
    constructor() {
        this.sceneManager = new SceneManager();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.health = 100;
        this.maxHealth = 100;
        this.healthDecayRate = 1; // per second

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.healthBar = document.getElementById('health-bar');
        this.mapModal = document.getElementById('map-modal');

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);

        document.getElementById('map-btn').addEventListener('click', () => this.toggleMap(true));
        document.getElementById('close-map-btn').addEventListener('click', () => this.toggleMap(false));

        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roomName = e.target.getAttribute('data-room');
                this.switchRoom(roomName);
            });
        });

        this.animate();
        this.startHealthDecay();
    }

    toggleMap(show) {
        if (show) {
            this.mapModal.classList.remove('hidden');
        } else {
            this.mapModal.classList.add('hidden');
        }
    }

    switchRoom(roomName) {
        this.sceneManager.setScene(roomName);
        this.toggleMap(false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.sceneManager.getScene().children, true);

        if (intersects.length > 0) {
            let object = intersects[0].object;
            while (object.parent && !object.userData.healthEffect) {
                object = object.parent;
            }

            if (object.userData.healthEffect && !object.userData.onCooldown) {
                this.increaseHealth(object.userData.healthEffect);
                this.triggerCooldown(object);
                this.triggerVisualFeedback(object);
                this.showHealthPopup(object.userData.healthEffect, event.clientX, event.clientY);
            }
        }
    }

    showHealthPopup(amount, x, y) {
        const popup = document.createElement('div');
        popup.className = 'health-popup';
        popup.innerText = `+${amount} HP`;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    triggerCooldown(object) {
        object.userData.onCooldown = true;
        setTimeout(() => {
            object.userData.onCooldown = false;
        }, object.userData.cooldown);
    }

    triggerVisualFeedback(object) {
        const originalScale = object.scale.x;
        const targetScale = originalScale * 1.2;
        const duration = 100;

        // Scale up
        let startTime = Date.now();
        const animateScaleUp = () => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < duration) {
                const scale = originalScale + (targetScale - originalScale) * (elapsedTime / duration);
                object.scale.set(scale, scale, scale);
                requestAnimationFrame(animateScaleUp);
            } else {
                object.scale.set(targetScale, targetScale, targetScale);
                // Scale down
                startTime = Date.now();
                const animateScaleDown = () => {
                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime < duration) {
                        const scale = targetScale - (targetScale - originalScale) * (elapsedTime / duration);
                        object.scale.set(scale, scale, scale);
                        requestAnimationFrame(animateScaleDown);
                    } else {
                        object.scale.set(originalScale, originalScale, originalScale);
                    }
                };
                animateScaleDown();
            }
        };
        animateScaleUp();
    }

    startHealthDecay() {
        setInterval(() => {
            this.decreaseHealth(this.healthDecayRate);
        }, 1000);
    }

    decreaseHealth(amount) {
        this.health = Math.max(0, this.health - amount);
        this.updateHealthBar();
    }

    increaseHealth(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthPercentage = (this.health / this.maxHealth) * 100;
        this.healthBar.style.width = `${healthPercentage}%`;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const scene = this.sceneManager.getScene();
        scene.children.forEach(child => {
            if (child.isGroup) { // Assuming loaded models are groups
                child.rotation.y += 0;
            }
        });

        this.renderer.render(scene, this.camera);
    }
}

const game = new Game();