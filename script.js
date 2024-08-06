import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GUI } from 'https://cdn.skypack.dev/dat.gui';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

if (WebGL.isWebGL2Available()) {
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

	//MESH
	const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
	const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
	const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.receiveShadow = true;
	groundMesh.position.y = -2;
	scene.add(groundMesh);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
	let oldMesh = new THREE.Mesh(geometry, material);
	oldMesh.castShadow = true;
	oldMesh.receiveShadow = true;
	scene.add(oldMesh);

	let currentMesh = 'cube';
	function updateMesh(selectedMesh) {
		if (selectedMesh === currentMesh)
			return;
		let newGeometry;
		switch (selectedMesh) {
			case 'cube':
				newGeometry = new THREE.BoxGeometry();
				break;
			case 'sphere':
				newGeometry = new THREE.SphereGeometry(1, 32, 32);
				break;
			case 'cylinder':
				newGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
				break;
			case 'cone':
				newGeometry = new THREE.ConeGeometry(1, 2, 32);
				break;
			case 'torus':
				newGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
				break;
			case 'dodecahedron':
				newGeometry = new THREE.DodecahedronGeometry(1);
				break;
			case 'icosahedron':
				newGeometry = new THREE.IcosahedronGeometry(1);
				break;
		}
		if (newGeometry) {
			console.log('old mesh', oldMesh);
			scene.remove(oldMesh);
			oldMesh.geometry.dispose();
			oldMesh.material.dispose();
			oldMesh = undefined;
			let newMesh = new THREE.Mesh(newGeometry, material);
			newMesh.castShadow = true;
			newMesh.receiveShadow = true;

			console.log(newMesh);

			scene.add(newMesh);
			oldMesh = newMesh;
		}
	}



	//LIGHTING
	// Ambient Light
	const al = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(al);

	// Directional Light
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



	//GUI
	const gui = new GUI();

//mesh list: cube, sphere, cynlider, cone, torus,
			// Dodecahedro, Icosahedron, Polyhedro

	const meshFolder = gui.addFolder('Which Mesh ?');
	//implement import blender file
	const meshOption = {mesh: 'cube'};
	meshFolder.add(meshOption, 'mesh', ['cube', 'sphere', 'cylinder', 'cone', 'torus', 'dodecahedron', 'icosahedron']).onChange(updateMesh);
	updateMesh(meshOption);
	meshFolder.open();
		

	const meshMaterialFolder = gui.addFolder('Mesh Material');
	const params = {
		color: 0xd3d3d3,
		metalness: 0.5,
		roughness: 0.5
	};
	meshMaterialFolder.addColor(params, 'color').onChange(value => {
		cube.material.color.set(value);
	});
	meshMaterialFolder.add(params, 'metalness', 0, 1).onChange(value => {
		cube.material.metalness = value;
	});
	meshMaterialFolder.add(params, 'roughness', 0, 1).onChange(value => {
		cube.material.roughness = value;
	});
	meshMaterialFolder.close();

	const alFolder = gui.addFolder('Ambient Light');
	const alSettings = { color: al.color.getHex() };
	alFolder.add(al, 'visible');
	alFolder.add(al, 'intensity', 0, 1, 0.1);
	alFolder
		.addColor(alSettings, 'color')
		.onChange((value) => al.color.set(value));
	alFolder.close();

	const dlSettings = {
		visible: true,
		color: dl.color.getHex(),
	};
	const dlFolder = gui.addFolder('Directional Light');
	dlFolder.add(dlSettings, 'visible').onChange((value) => {
		dl.visible = value;
		dlHelper.visible = value;
	});
	dlFolder.add(dl, 'intensity', 0, 1, 0.25);
	dlFolder
		.addColor(dlSettings, 'color')
		.onChange((value) => dl.color.set(value));
	dlFolder.open();
	

	const controls = new OrbitControls(camera, renderer.domElement);

	
	function animate() {
		updateLightPosition();
		controls.update();
		renderer.render(scene, camera);
	}


} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById('container').appendChild(warning);
}
