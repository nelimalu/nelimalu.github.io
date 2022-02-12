function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function moveButton() {
	let button = document.getElementById("button");
	button.style.top = randint(5, 95).toString() + "%";
	button.style.left = randint(5, 95).toString() + "%";
}

function clickButton() {
	let title = document.getElementById("title");
	title.innerHTML = "nice :thumbsup:"
}
