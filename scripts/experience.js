var characters = "`1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:\"|ZXCVBNM<>?|";

function randomChar() {
	return characters.charAt(Math.floor(Math.random() * characters.length));
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setChar(string, index, value) {
	string = string.split('');
	string[index] = value;
	return string.join('');
}


window.addEventListener("DOMContentLoaded", (event) => {
	var cycle = ['about me', 'luka jovanovic'];
	var cycleIndex = 0;

	setInterval(() => {
	
		let title = document.getElementById("title-text");
		let currentWord = cycle[cycleIndex];
		cycleIndex++;
		cycleIndex %= cycle.length;
		let nextWord = cycle[cycleIndex];
		let counter = 0;

		let randomizeInterval = setInterval(() => {
			counter++;

			if (currentWord.length < nextWord.length)
				currentWord += randomChar();
			if (currentWord.length > nextWord.length)
				currentWord = currentWord.slice(0, -1);

			let randomIndex = randint(0, currentWord.length - 1);
			currentWord = setChar(currentWord, randomIndex, randomChar());
			title.innerHTML = currentWord;


			if (counter > 10)
				clearInterval(randomizeInterval);
		}, 50);

		let organizeInterval = setInterval(() => {
			counter++;


			let randomIndex = randint(0, currentWord.length - 1);
			currentWord = setChar(currentWord, randomIndex, nextWord[randomIndex]);
			title.innerHTML = currentWord;


			if (title.innerHTML === nextWord)
				clearInterval(organizeInterval);
		}, 50);

	}, 10000);

});