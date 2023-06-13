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
	var cycle = ['RUN', 'URB'];
	var cycleIndex = 0;

	setInterval(() => {
	
		let title = document.getElementById("run-urb");
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
		}, 100);

	}, 5000);

});


var firstItem = document.getElementById('urban-dev-image');
var secondItem = document.getElementById('what-is-subrun-image');
var thirdItem = document.getElementById('contribution-image');
var body = document.getElementById("body");
var content = document.getElementById("content");

;(function(){

  var throttle = function(type, name, obj){
    var obj = obj || window;
    var running = false;
    var func = function(){
      if (running){ return; }
      running = true;
      requestAnimationFrame(function(){
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
  
  throttle("scroll", "optimizedScroll");
})();

window.addEventListener("optimizedScroll", function(){
	// FIRST ITEM
	let translateamount = ((-window.pageYOffset) / 10) + 120;
	if (translateamount < 30)
		translateamount = 30;
	let translate = "translateX(" + translateamount + "%) ";
	let rotate = "rotate(" + (window.pageYOffset / 50) + "deg)";

	firstItem.style.transform = translate + rotate;

	// SECOND ITEM
	translateamount = ((window.pageYOffset - 400) / 10) - 120;
	if (translateamount > 0)
		translateamount = 0;
	translate = "translateX(" + translateamount + "%) ";
	rotate = "rotate(" + (window.pageYOffset / 50) + "deg)";

	secondItem.style.transform = translate + rotate;

	// THIRD ITEM
	translateamount = ((-window.pageYOffset) / 10) + 260;
	if (translateamount < 20)
		translateamount = 20;
	translate = "translateX(" + translateamount + "%) ";
	rotate = "rotate(" + (window.pageYOffset / 50) + "deg)";

	console.log(translateamount)
	thirdItem.style.transform = translate + rotate;

	if (window.pageYOffset > 1600 && window.pageYOffset < 2300) {
		body.style.backgroundColor = "black";
		content.style.color = "white";
	} else {
		body.style.backgroundColor = "white";
		content.style.color = "black";
	}
})
