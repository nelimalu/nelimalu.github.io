var phase = 0;
var name = "";
var email = "";
var message = "";

function next() {
	let input = document.getElementById("input");
	let inputArea = document.getElementById("input-area");
	let title = document.getElementById("title");
	let backButton = document.getElementById("prev");
	let nextButton = document.getElementById("next");

	if (phase == 0) {
		name = input.value;
		input.value = "";
		input.placeholder = "john.smith@example.com";
		backButton.classList.remove("disable");

		title.innerHTML = "Hi" + (name.length > 0 ? " " : "") + name + ", what's your email address?";
	}
	if (phase == 1) {
		email = input.value;
		input.value = "";
		input.placeholder = "please be nice...";

		title.innerHTML = "Feel free to send me a message!";
	} if (phase == 2) {
		message = input.value;
		nextButton.classList.add("disable");
		inputArea.innerHTML = `
			<div class="send-container">
				<button id="send" onclick="send()">SEND!</button>
			</div>
		`;

		title.innerHTML = "You're all set! Just one more click.";
	}

	phase++;
	if (phase > 3)
		phase = 3;
}

function prev() {
	let input = document.getElementById("input");
	let inputArea = document.getElementById("input-area");
	let title = document.getElementById("title");
	let backButton = document.getElementById("prev");
	let nextButton = document.getElementById("next");

	if (phase == 1) {
		backButton.classList.add("disable");
		title.innerHTML = "Hello 👋 What's your name?"
		input.placeholder = "John Smith";
		input.value = name;
	}
	if (phase == 2) {
		input.value = email;
		input.placeholder = "john.smith@example.com";

		title.innerHTML = "Hi" + (name.length > 0 ? " " : "") + name + ", what's your email address?";
	}
	if (phase == 3) {
		
		inputArea.innerHTML = `
			<input type='text' class="input-text" id="input" autocomplete="off" placeholder="please be nice...">
		`;
		let input = document.getElementById("input");
		input.value = message;
		nextButton.classList.remove('disable');

		title.innerHTML = "Feel free to send me a message!";
	}
	phase--;

	if (phase < 0)
		phase = 0;
}

function send() {
	console.log('sent!?');
	document.location = `mailto:lukaj2501@gmail.com?subject=Hello from ${name}&body=${message}`;
}