import * as THREE from 'three';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

        this.scene.background = new THREE.Color(0xeeeeee);

        this.camera.position.z = 5;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        this.scene.add(directionalLight);

        // Room
        const roomSize = 10;
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const floor = new THREE.Mesh(floorGeometry, wallMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -roomSize / 2;
        this.scene.add(floor);

        // Ceiling
        const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomSize / 2;
        this.scene.add(ceiling);

        // Walls
        const wallGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -roomSize / 2;
        this.scene.add(backWall);

        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.z = roomSize / 2;
        frontWall.rotation.y = Math.PI;
        this.scene.add(frontWall);

        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.x = -roomSize / 2;
        leftWall.rotation.y = Math.PI / 2;
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.x = roomSize / 2;
        rightWall.rotation.y = -Math.PI / 2;
        this.scene.add(rightWall);


        // Add some placeholder objects
        const geometry = new THREE.BoxGeometry();
        const material1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube1 = new THREE.Mesh(geometry, material1);
        cube1.position.x = -2;
        cube1.userData = { healthEffect: 20, cooldown: 5000, onCooldown: false };
        this.scene.add(cube1);

        const material2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const cube2 = new THREE.Mesh(geometry, material2);
        cube2.position.x = 2;
        cube2.userData = { healthEffect: 10, cooldown: 3000, onCooldown: false };
        this.scene.add(cube2);

        this.healthBar = document.getElementById('health-bar');

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('click', this.onMouseClick.bind(this), false);

        this.animate();
        this.startHealthDecay();
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
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.healthEffect && !object.userData.onCooldown) {
                this.increaseHealth(object.userData.healthEffect);
                this.triggerCooldown(object);
                this.triggerVisualFeedback(object);
            }
        }
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

        this.scene.children.forEach(child => {
            if (child.isMesh && (child.geometry instanceof THREE.BoxGeometry)) {
                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

const game = new Game();