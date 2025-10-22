import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class SceneManager {
    constructor() {
        this.loader = new GLTFLoader();
        this.scenes = {
            'bedroom': this.createBedroom(),
            'kitchen': this.createKitchen(),
            'living_room': this.createLivingRoom(),
        };
        this.currentScene = this.scenes['bedroom'];
    }

    createBedroom() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xadd8e6); // Light blue

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        scene.add(directionalLight);

        // Room
        this.createRoom(scene, 10, 0xadd8e6);

        // Objects
        this.loader.load('models/bedroom/bed.glb', (gltf) => {
            const bed = gltf.scene;
            bed.scale.set(0.5, 0.5, 0.5);
            bed.position.x = -2;
            bed.userData = { healthEffect: 20, cooldown: 5000, onCooldown: false };
            scene.add(bed);
        });

        return scene;
    }

    createKitchen() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffff99); // Light yellow

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        scene.add(directionalLight);

        // Room
        this.createRoom(scene, 12, 0xffff99);

        // Objects
        this.loader.load('models/kitchen/fridge.glb', (gltf) => {
            const fridge = gltf.scene;
            fridge.scale.set(0.5, 0.5, 0.5);
            fridge.position.x = 2;
            fridge.userData = { healthEffect: 10, cooldown: 3000, onCooldown: false };
            scene.add(fridge);
        });

        return scene;
    }

    createLivingRoom() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x90ee90); // Light green

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        scene.add(directionalLight);

        // Room
        this.createRoom(scene, 15, 0x90ee90);

        // Objects
        this.loader.load('models/living_room/chair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(0.5, 0.5, 0.5);
            chair.position.x = 0;
            chair.userData = { healthEffect: 5, cooldown: 2000, onCooldown: false };
            scene.add(chair);
        });

        return scene;
    }

    createRoom(scene, roomSize, color) {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: color });

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const floor = new THREE.Mesh(floorGeometry, wallMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -roomSize / 2;
        scene.add(floor);

        // Ceiling
        const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomSize / 2;
        scene.add(ceiling);

        // Walls
        const wallGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -roomSize / 2;
        scene.add(backWall);

        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.z = roomSize / 2;
        frontWall.rotation.y = Math.PI;
        scene.add(frontWall);

        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.x = -roomSize / 2;
        leftWall.rotation.y = Math.PI / 2;
        scene.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.x = roomSize / 2;
        rightWall.rotation.y = -Math.PI / 2;
        scene.add(rightWall);
    }

    getScene() {
        return this.currentScene;
    }

    setScene(name) {
        this.currentScene = this.scenes[name];
    }
}