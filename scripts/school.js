const FONT_SIZE = 70;
const MESSAGES = [
	"Welcome!",
	"These are my AP Notes.",
	"Feel free to use them.",
	"(Krasteva give good mark pls <3)",
];

function createMessage(message) {

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const skipAnimation = urlParams.get('skip');

	let v = new Vara("#handwritten","https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
		[{
			text: message,
			y: 20,
			fromCurrentPosition: {y: false, x: false},
			duration: 217 * message.length,  // 5000
			letterSpacing: -5
		}],
		{
			color: "#fff",
			strokeWidth: 2,
			fontSize: FONT_SIZE,
			textAlign: "center"
		}
	);

	
	v.ready(() => {
		let erase = true;
		v.animationEnd((i, o) => {
			if (i == "no_erase")
				erase = false;
			if (erase) {
				o.container.style.transition = "opacity 1s 0.5s";  // 1s 1s
				o.container.style.opacity = 0;
			}


			/*
			body = document.getElementsByTagName('body')[0];

			if (!skipAnimation) {

				setTimeout(() => {
					document.getElementById('handwritten').remove();
					body.style = `
					background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #221e22, #141b25, #141b25, #141b25, #141b25);
					background-size: 400% 400%;
					animation: gradient 7.5s ease;
					background-position: 100% 50%;`;// 7.5s [keep this comment here]
				}, 1000)

				setTimeout(function(){ 
					document.getElementsByClassName('notes-container')[0].classList.add('fadein');
				    //document.getElementsByClassName('notes-container')[0].style.visibility = 'visible';
				}, 6000); // 1000

				setTimeout(() => {
					document.getElementsByClassName('notes-container')[0].style.opacity = 1;
				}, 7000);
			} else {
				
				document.getElementsByClassName('notes-container')[0].style.opacity = 1;
				body.style = `
					background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #221e22, #141b25, #141b25, #141b25, #141b25);
					background-size: 400% 400%;
					background-position: 100% 50%;`;
			}
			*/
			
		})

		
	});
}


window.addEventListener('DOMContentLoaded', (event) => {
	let currentIndex = 0;

	animate = () => {
		document.getElementById("handwritten").innerHTML = "";
	    createMessage(MESSAGES[currentIndex]);
	    currentIndex++;
	    currentIndex %= MESSAGES.length;

	    setTimeout(animate, (217 * MESSAGES[currentIndex - 1 < 0 ? MESSAGES.length - 1 : currentIndex - 1].length) + 1500);
	}

	animate();
});

/*
var canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var TOP_LEFT = [0, 0];
var TOP_RIGHT = [0, window.innerWidth];
var BOTTOM_LEFT = [window.innerHeight, 0];
var BOTTOM_RIGHT = [window.innerHeight, window.innerWidth];

var scrollCounter = 0;
const SCROLL_RATE = 200;

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	TOP_LEFT = [0, 0];
	TOP_RIGHT = [0, window.innerWidth];
	BOTTOM_LEFT = [window.innerHeight, 0];
	BOTTOM_RIGHT = [window.innerHeight, window.innerWidth];
});

window.addEventListener("wheel", (e) => {
	scrollCounter += SCROLL_RATE;
});



function gradient(start, end, colour1, colour2) {
	const default_gradient = c.createLinearGradient(...start, ...end);
	default_gradient.addColorStop(0, colour1);
	default_gradient.addColorStop(1, colour2);
	return default_gradient;
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
	return [randint(0, 255), randint(0, 255), randint(0, 255)];
}

function now() {
	//return Date.now();
	return scrollCounter;
}

class Colour {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	copy() {
		return new Colour(this.r, this.g, this.b);
	}

	makeRGB(alpha) {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
	}
}

class SimpleGradient {
	constructor(colour1, colour2) {
		this.colour1 = colour1;
		this.colour2 = colour2;
		this.interpolation = 1;
		this.currentcolour = colour1.copy();
		this.interpolationSpeed = randint(2000, 2500);
	}

	makeRGB(alpha) {
		return this.currentcolour.makeRGB(alpha);
	}

	lerp(one, two, value) {
		return Math.round(one * (1 - value) + two * value);
	}

	interpolate(value) {
		this.currentcolour.r = this.lerp(this.colour1.r, this.colour2.r, value);
		this.currentcolour.g = this.lerp(this.colour1.g, this.colour2.g, value);
		this.currentcolour.b = this.lerp(this.colour1.b, this.colour2.b, value);
	}

	update() {
		let x = Math.abs(Math.sin(now() / this.interpolationSpeed));
		this.interpolate(x);
	}


}


class AnimatedGradient {
	constructor(gradient1, gradient2, gradient3, gradient4) {
		this.gradient1 = gradient1;
		this.gradient2 = gradient2;
		this.gradient3 = gradient3;
		this.gradient4 = gradient4;

		this.top_alpha = 0.5;
		this.bottom_alpha = 0.25;
	}

	update() {
		this.gradient1.update();
		this.gradient2.update();
		this.gradient3.update();
		this.gradient4.update();
	}

	draw() {
		this.update();
		let gradients = [
			gradient(
				TOP_LEFT, BOTTOM_RIGHT,
				this.gradient1.makeRGB(this.top_alpha),
				this.gradient2.makeRGB(this.top_alpha)
			),
			gradient(
				TOP_RIGHT, BOTTOM_LEFT,
				this.gradient3.makeRGB(this.bottom_alpha),
				this.gradient4.makeRGB(this.bottom_alpha)
			)
		];

		for (let gradient of gradients) {
			c.fillStyle = gradient;
	    	c.fillRect(0, 0, canvas.width, canvas.height);
		}

		
	}
}

let colours = [
	new SimpleGradient(new Colour(...randomRGB()), new Colour(...randomRGB())),
	new SimpleGradient(new Colour(...randomRGB()), new Colour(...randomRGB())),
	new SimpleGradient(new Colour(...randomRGB()), new Colour(...randomRGB())),
	new SimpleGradient(new Colour(...randomRGB()), new Colour(...randomRGB()))
];

var background = new AnimatedGradient(...colours);

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    background.draw();

    c.fillStyle = 'rgba(20, 27, 37, 1)';
	c.fillRect(0, -(scrollCounter / SCROLL_RATE * 25), canvas.width, canvas.height);
}
animate();
*/