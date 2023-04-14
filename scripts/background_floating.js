// get canvas element
var canvas = document.getElementById('background');

// set up three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});

var frame = 0;

renderer.setClearColor("#101010");
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;
camera.updateProjectionMatrix();
document.body.appendChild(renderer.domElement);


/* HELPERS */


window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

function rgb(red, green, blue) {
	return new THREE.Color("rgb(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")");
}

function rad(deg) {
	return deg * Math.PI / 180;
}


/* THREE JS */


function createSphere() {
	var geometry = new THREE.SphereGeometry(1, 100, 100);  // distance, vertical vertices, horizontal vertices
	var material = new THREE.MeshLambertMaterial({color: rgb(255,165,0)});
	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.set(0,0,0);
	scene.add(mesh);
}

function createPrism() {
	const geometry = new THREE.BoxGeometry(3, 1, 1);
	const material = new THREE.MeshLambertMaterial({ color: rgb(35, 166, 213) });
	geometry.rotateY(rad(-45));
	geometry.rotateX(rad(45))
	geometry.translate(4, 0, 0);
	
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
}

function setLight(position, intensity=1) {
	var light = new THREE.PointLight(0xFFFFFF, intensity, 10000);  // colour, intensity, distance
	light.position.set(position.x, position.y, position.z);  // x y z
	light.castShadow = true;
	scene.add(light);
}

function createFloor() {
	var geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
	var material = new THREE.MeshBasicMaterial( { color: 0x383838/*, wireframe: true*/ } );
	var floor = new THREE.Mesh( geometry, material );
	floor.material.side = THREE.DoubleSide;
	floor.translateY(-10);
	floor.rotation.x = rad(90);


	scene.add(floor);
}

class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Prism {
	constructor(position, angle, dimensions, colour) {
		this.position = position;
		this.colour = colour;
		this.frameOffset = Math.random();
		this.geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
		this.material = new THREE.MeshLambertMaterial({ color: colour });
		this.updatePosition();
		this.updateAngles(angle.x, angle.y, angle.z);
		
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		scene.add(this.mesh);
	}

	updateAngles(x, y, z) {
		this.geometry.dynamic = true;
		this.geometry.translate(-this.position.x, -this.position.y, -this.position.z);
		this.geometry.rotateX(rad(x));
		this.geometry.rotateY(rad(y));
		this.geometry.rotateZ(rad(z));
		this.geometry.translate(this.position.x, this.position.y, this.position.z);
	}

	updatePosition() {
		this.geometry.dynamic = true;		
		this.geometry.translate(this.position.x, this.position.y, this.position.z);
		// this.geometry.verticesNeedUpdate = true;
	}

	hover() {
		let angleChange = Math.sin((frame * this.frameOffset) / 100) / 50;
		
		this.updateAngles(angleChange / 2, angleChange, angleChange * 2);

	}
}

createFloor();

setLight(new Vector(0, 0, 0));
//setLight(new Vector(3, -0.5, 1), 0.3);
//setLight(new Vector(8, 0.5, 3));
//setLight(new Vector(0, -3, 1), 0.3);


let prisms = [
	new Prism(
		new Vector(4, 1, 0),  // position
		new Vector(0, -70, 0),  // angle
		new Vector(2, 1, 1),  // width, height, depth
		rgb(35, 166, 213)
	),
	new Prism(
		new Vector(3, -1, 0),  // position
		new Vector(0, 20, 0),  // angle
		new Vector(3, 1, 1),  // width, height, depth
		rgb(231, 60, 126)
	),
];


function render() {
	requestAnimationFrame(render);
	frame++;
	frame %= 1000000;

	for (let prism of prisms) {
		prism.hover();
	}

	renderer.render(scene, camera);
}

render();