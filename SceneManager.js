import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

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
        // IMPORTANT: Replace the placeholder filenames below with the actual filenames of your textures
        this.createRoom(scene, 10, 'textures/floor.jpg', 'textures/wall.jpg', 'textures/ceiling.jpg', { wall: 'right', width: 3, height: 4, color: 0x87CEEB, windowWallColor: 0xadd8e6 });

        // Objects
        this.loader.load('models/bedroom/bed.glb', (gltf) => {
            const bed = gltf.scene;
            bed.scale.set(2, 2, 2);
            bed.position.x = -3;
            bed.position.y = -5;
            bed.position.z = -2.8;
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
        // IMPORTANT: Replace the placeholder filenames below with the actual filenames of your textures
        this.createRoom(scene, 12, 'textures/floor.jpg', 'textures/wall.jpg', 'textures/ceiling.jpg', { wall: 'left', width: 4, height: 3, color: 0x87CEEB, windowWallColor: 0xffff99 });

        // Objects
        this.loader.load('models/kitchen/fridge.glb', (gltf) => {
            const fridge = gltf.scene;
            fridge.scale.set(1.5, 1.5, 1.5);
            fridge.position.x = -4;
            fridge.position.y = -5;
            fridge.position.z = -3.5;
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
        // IMPORTANT: Replace the placeholder filenames below with the actual filenames of your textures
        this.createRoom(scene, 15, 'textures/floor.jpg', 'textures/wall.jpg', 'textures/ceiling.jpg');

        // Objects
        this.loader.load('models/living_room/chair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(2, 2, 2);
            chair.position.x = -5;
            chair.position.y = -6;
            chair.position.z = -3.8;
            chair.userData = { healthEffect: 5, cooldown: 2000, onCooldown: false };
            scene.add(chair);
        });

        // Objects
        this.loader.load('models/living_room/couch.glb', (gltf) => {
            const couch = gltf.scene;
            couch.scale.set(1, 1, 1);
            couch.rotateY(-Math.PI / 4);
            couch.position.x = 5;
            couch.position.y = -6;
            couch.position.z = -3.8;
            couch.userData = { healthEffect: 20, cooldown: 2000, onCooldown: false };
            scene.add(couch);
        });

        return scene;
    }

    createWindow(width, height, color) {
        const windowGroup = new THREE.Group();

        // Window Pane
        const paneGeometry = new THREE.PlaneGeometry(width, height);
        const paneMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
        const pane = new THREE.Mesh(paneGeometry, paneMaterial);
        windowGroup.add(pane);

        // Window Frame
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // SaddleBrown
        const frameTop = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.1, 0.1), frameMaterial);
        frameTop.position.y = height / 2 + 0.05;
        windowGroup.add(frameTop);

        const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.1, 0.1), frameMaterial);
        frameBottom.position.y = -height / 2 - 0.05;
        windowGroup.add(frameBottom);

        const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, height + 0.2, 0.1), frameMaterial);
        frameLeft.position.x = -width / 2 - 0.05;
        windowGroup.add(frameLeft);

        const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, height + 0.2, 0.1), frameMaterial);
        frameRight.position.x = width / 2 + 0.05;
        windowGroup.add(frameRight);

        return windowGroup;
    }

    createWallWithHole(roomSize, wallMaterial, windowWidth, windowHeight, windowColor) {
        const wall = new THREE.Group();

        // Wall parts around the window
        const wallParts = [
            { x: 0, y: (roomSize + windowHeight) / 4, width: roomSize, height: (roomSize - windowHeight) / 2 }, // Top
            { x: 0, y: -(roomSize + windowHeight) / 4, width: roomSize, height: (roomSize - windowHeight) / 2 }, // Bottom
            { x: -(roomSize + windowWidth) / 4, y: 0, width: (roomSize - windowWidth) / 2, height: windowHeight }, // Left
            { x: (roomSize + windowWidth) / 4, y: 0, width: (roomSize - windowWidth) / 2, height: windowHeight } // Right
        ];

        wallParts.forEach(part => {
            const geometry = new THREE.PlaneGeometry(part.width, part.height);
            const mesh = new THREE.Mesh(geometry, wallMaterial);
            mesh.position.set(part.x, part.y, 0);
            wall.add(mesh);
        });

        // Window
        const window = this.createWindow(windowWidth, windowHeight, windowColor);
        wall.add(window);

        return wall;
    }

    createRoom(scene, roomSize, floorTexturePath, wallTexturePath, ceilingTexturePath, windowOptions = null) {
        const textureLoader = new TextureLoader();

        // IMPORTANT: Replace the placeholder filenames below with the actual filenames of your textures
        const floorTexture = textureLoader.load(floorTexturePath);
        const wallTexture = textureLoader.load(wallTexturePath);
        const ceilingTexture = textureLoader.load(ceilingTexturePath);

        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(2, 2);
        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(2, 2);
        ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(2, 2);

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -roomSize / 2;
        scene.add(floor);

        // Ceiling
        const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture });
        const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomSize / 2;
        scene.add(ceiling);

        // Walls
        const wallGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -roomSize / 2;
        scene.add(backWall);

        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.z = roomSize / 2;
        frontWall.rotation.y = Math.PI;
        scene.add(frontWall);

        if (windowOptions && windowOptions.wall === 'left') {
            const windowWallMaterial = new THREE.MeshStandardMaterial({ color: windowOptions.windowWallColor });
            const leftWall = this.createWallWithHole(roomSize, windowWallMaterial, windowOptions.width, windowOptions.height, windowOptions.color);
            leftWall.position.x = -roomSize / 2;
            leftWall.rotation.y = Math.PI / 2;
            scene.add(leftWall);
        } else {
            const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
            leftWall.position.x = -roomSize / 2;
            leftWall.rotation.y = Math.PI / 2;
            scene.add(leftWall);
        }

        if (windowOptions && windowOptions.wall === 'right') {
            const windowWallMaterial = new THREE.MeshStandardMaterial({ color: windowOptions.windowWallColor });
            const rightWall = this.createWallWithHole(roomSize, windowWallMaterial, windowOptions.width, windowOptions.height, windowOptions.color);
            rightWall.position.x = roomSize / 2;
            rightWall.rotation.y = -Math.PI / 2;
            scene.add(rightWall);
        } else {
            const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
            rightWall.position.x = roomSize / 2;
            rightWall.rotation.y = -Math.PI / 2;
            scene.add(rightWall);
        }
    }

    getScene() {
        return this.currentScene;
    }

    setScene(name) {
        this.currentScene = this.scenes[name];
    }
}