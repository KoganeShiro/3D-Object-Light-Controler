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
	groundMesh.position.y = -1;
	scene.add(groundMesh);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	//const material = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });
	const material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
	const cube = new THREE.Mesh(geometry, material);
	cube.castShadow = true;
	cube.receiveShadow = true;
	scene.add(cube);


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

	//GUI
	const gui = new GUI();

	const cubeFolder = gui.addFolder('Cube Material');
	const params = {
		color: 0xd3d3d3,
		metalness: 0.5,
		roughness: 0.5
	};
	cubeFolder.addColor(params, 'color').onChange(value => {
		cube.material.color.set(value);
	});
	cubeFolder.add(params, 'metalness', 0, 1).onChange(value => {
		cube.material.metalness = value;
	});
	cubeFolder.add(params, 'roughness', 0, 1).onChange(value => {
		cube.material.roughness = value;
	});
	cubeFolder.open();

	const alFolder = gui.addFolder('Ambient Light');
	const alSettings = { color: al.color.getHex() };
	alFolder.add(al, 'visible');
	alFolder.add(al, 'intensity', 0, 1, 0.1);
	alFolder
		.addColor(alSettings, 'color')
		.onChange((value) => al.color.set(value));
	alFolder.open();

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
	dlFolder.add(dl, 'castShadow');
	dlFolder
		.addColor(dlSettings, 'color')
		.onChange((value) => dl.color.set(value));
	dlFolder.open();
	

	const controls = new OrbitControls(camera, renderer.domElement);

	
	function animate() {
		controls.update();
		renderer.render(scene, camera);
	}


} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById('container').appendChild(warning);
}
