var canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var grd = c.createLinearGradient(0, 0, 0, window.innerWidth);
grd.addColorStop(0, "#141b25");
grd.addColorStop(1, "#221e22");


class Orb {
	center = {
		x: window.innerWidth * 0.75,
		y: window.innerHeight / 2
	};

	constructor(x, y, angle, force, colour, radius) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.force = force;
		this.colour = colour;
		this.radius = radius;
	}

	draw() {
		drawCircle(this.x, this.y, this.radius, this.colour);
		drawCircle(this.center.x, this.center.y, 10, "#000");
	}

	update() {
		let force = 2 / distance(this, this.center);
		let angle = getAngle(this, this.center);

		let midpoint = moveAlongAngle(this.x, this.y, this.angle, this.force);
		let final = moveAlongAngle(midpoint.x, midpoint.y, angle, force);

		this.angle = getAngle(this, final);
		this.force = 2 / distance(this, final);

		this.x = final.x;
		this.y = final.y;
	}
}

const degsToRads = deg => (deg * Math.PI) / 180.0;

function distance(p1, p2) {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.x - p1.x) ** 2);
}

function drawLine(x1, y1, x2, y2) {
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2)
	c.stroke();
}

function drawCircle(x, y, radius, colour) {
	c.beginPath();
	c.arc(x, y, radius, 0, 2 * Math.PI, false);
	c.fillStyle = colour;
	c.fill();
}

function moveAlongAngle(x, y, angle, distance) {
	let x2 = x + Math.sin(angle) * distance;
    let y2 = y + Math.cos(angle) * distance;
    return {x: x2, y: y2};
}

function getAngle(p1, p2) {
	return -Math.atan2(p1.y - p2.y, p1.x - p2.x) - degsToRads(90);
}

function generateOrbs(amount) {
	let orbs = [];
	for (let i = 0; i < amount; i++) {
		orbs.push(new Orb(400, 300, degsToRads(50), 30, "white", 20));
	}
	return orbs;
}

var orbs = generateOrbs(1);

function animate() {
    window.requestAnimationFrame(animate);
    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

    c.fillStyle = grd;
    c.fillRect(0, 0, canvas.width, canvas.height);

    for (let orb of orbs) {
    	orb.draw();
    	orb.update();
    }
}
animate();