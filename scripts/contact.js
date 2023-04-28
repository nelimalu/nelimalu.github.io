var canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var mouse = {
	x: 0,
	y: 0
}

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", (event) => {
	let rect = canvas.getBoundingClientRect();
	mouse.x = event.clientX// - rect.left;
	mouse.y = event.clientY //- rect.top;
});

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randintExcludeZero(min, max) {
	let x;
	do {
		x = randint(min, max);
	} while (x == 0);
	return x;
}

function mapRange(value, inmin, inmax, outmin, outmax) {
	let inRange = inmax - inmin;
	let outRange = outmax - outmin;
	let percentage = (value - inmin) / inRange;
	return (outRange * percentage) + outmin;
}

function distance(x1, y1, x2, y2) {
	return Math.hypot(x2 - x1, y2 - y1);
}


class Orb {
	constructor(x, y, xvel, yvel, radius, colour) {
		this.x = x;
		this.y = y;
		this.xvel = xvel;
		this.yvel = yvel;
		this.radius = radius;
		this.drawRadius = radius;
		this.colour = colour;
	}

	update() {
		this.x += this.xvel;
		this.y += this.yvel;

		if (this.x < 0) {
			this.xvel *= -1;
			this.x = 0;
		} else if (this.x > window.innerWidth) {
			this.xvel *= -1;
			this.x = window.innerWidth;
		}
		if (this.y < 0) {
			this.yvel *= -1;
			this.y = 0;
		} else if (this.y > window.innerHeight) {
			this.yvel *= -1;
			this.y = window.innerHeight;
		}

	}

	nearby() {
		let dist = distance(mouse.x, mouse.y, this.x, this.y);

		if (dist < 200 && this.drawRadius < this.radius + 50) {
			this.drawRadius++;
		}
		else if (this.drawRadius > this.radius) {
			this.drawRadius--;
		}
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.drawRadius, 0, Math.PI * 2);
		c.fillStyle = this.colour;
		c.strokeStyle = this.colour;
		c.fill();
		c.stroke();
	}
}

const COLOURS = [
	"rgba(243,177,205,255)",
	"rgba(248,215,232,255)",
	"rgba(186,213,240,255)",
	"rgba(214,239,246,255)",
	"rgba(248,239,230,255)",
	"rgba(250,228,205,255)",
	"rgba(240,213,186,255)",
	"rgba(227,167,192,255)",
	"rgba(176,171,203,255)",
	"rgba(194,213,168,255)",
	"rgba(242,233,204,255)",
	"rgba(165,213,213,255)"
];

var orbs = [];

for (let i = 0; i < 100; i++) {
	let x = randint(0, window.innerWidth);
	let y = randint(0, window.innerHeight);
	let radius = randint(0, 0);
	let xvel = randintExcludeZero(-2, 2);
	let yvel = randintExcludeZero(-2, 2);
	
	let colour = COLOURS[randint(0, COLOURS.length - 1)];
	orbs.push(new Orb(x, y, xvel, yvel, radius, colour));
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "rgba(22,27,36,1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let orb of orbs) {
    	orb.update();
    	orb.nearby();
    	orb.draw();
    }
}
animate();