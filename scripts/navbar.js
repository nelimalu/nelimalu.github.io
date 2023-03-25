function navEnter(element) {
	const links = document.querySelectorAll('.nav-button');

	for (let link of links) {
		for (let child of link.children) {
			child.style.color = "var(--shadow-text-colour)";
			child.style.textShadow = "0px 0px 0px #000"
		}
	}

	element.children[0].style.color = "var(--sub-text-colour)";
	element.children[0].style.textShadow = "0px 0px 2px var(--sub-text-colour)";

	element.children[1].style.color = "var(--text-colour)";
	element.children[1].style.textShadow = "0px 0px 2px var(--text-colour)";
}

function navExit(element) {
	const links = document.querySelectorAll('.nav-button');

	for (let link of links) {
		link.children[0].style.color = "var(--sub-text-colour)";
		link.children[0].style.textShadow = "0px 0px 2px var(--sub-text-colour)";

		link.children[1].style.color = "var(--text-colour)";
		link.children[1].style.textShadow = "0px 0px 2px var(--text-colour)";
	}
}