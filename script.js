import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';
//import { GUI } from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);


	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

	// MESH
	const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
	const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
	const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.receiveShadow = true;
	groundMesh.position.y = -1;
	scene.add(groundMesh);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
	const cube = new THREE.Mesh(geometry, material);
	cube.castShadow = true;
	cube.receiveShadow = true;
	scene.add(cube);

	// LIGHTING
	const al = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(al);

	const dl = new THREE.DirectionalLight(0xffffff, 1);
	dl.position.set(0, 5, 5);
	dl.castShadow = true;
	const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
	scene.add(dl);
	scene.add(dlHelper);

	// Keyboard Controls
	let angleX = 0;
	let angleY = Math.PI / 2;

	function updateLightPosition() {
		dl.position.x = 5 * Math.sin(angleX) * Math.cos(angleY);
		dl.position.z = 5 * Math.cos(angleX) * Math.cos(angleY);
		dl.position.y = 5 * Math.sin(angleY);
		dlHelper.update();
	}

	window.addEventListener('keydown', (event) => {
		const step = 0.01;
		switch (event.key) {
			case 'ArrowUp':
				angleY += step;
				break;
			case 'ArrowDown':
				angleY -= step;
				break;
			case 'ArrowLeft':
				angleX -= step;
				break;
			case 'ArrowRight':
				angleX += step;
				break;
		}
		updateLightPosition();
	});

	// GUI
	const gui = new dat.GUI(); 

	const cubeFolder = gui.addFolder('Cube Material');
	const params = { color: 0xd3d3d3, metalness: 0.5, roughness: 0.5 };
	cubeFolder.addColor(params, 'color').onChange(value => { cube.material.color.set(value); });
	cubeFolder.add(params, 'metalness', 0, 1).onChange(value => { cube.material.metalness = value; });
	cubeFolder.add(params, 'roughness', 0, 1).onChange(value => { cube.material.roughness = value; });
	cubeFolder.close();

	const alFolder = gui.addFolder('Ambient Light');
	const alSettings = { color: al.color.getHex() };
	alFolder.add(al, 'visible');
	alFolder.add(al, 'intensity', 0, 1, 0.1);
	alFolder.addColor(alSettings, 'color').onChange((value) => al.color.set(value));
	alFolder.close();

	const dlSettings = { visible: true, color: dl.color.getHex() };
	const dlFolder = gui.addFolder('Directional Light');
	dlFolder.add(dlSettings, 'visible').onChange((value) => {
		dl.visible = value;
		dlHelper.visible = value;
	});
	dlFolder.add(dl, 'intensity', 0, 1, 0.25);
	dlFolder.addColor(dlSettings, 'color').onChange((value) => dl.color.set(value));
	dlFolder.open();

	const controls = new OrbitControls(camera, renderer.domElement);


	function animate() {
		updateLightPosition();
		controls.update();
		renderer.render(scene, camera);
	}
