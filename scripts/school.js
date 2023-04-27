window.addEventListener('DOMContentLoaded', (event) => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const skipAnimation = urlParams.get('skip');
	let font_size = 70;

	let v = new Vara("#handwritten","https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
		[{
			text: "Looking For Something AP?",
			y: window.innerHeight / 2 - font_size,
			fromCurrentPosition: {y: false, x: false},
			duration: skipAnimation ? 0 : 5000,  // 5000
			letterSpacing: -5
		}],
		{
			color: "#fff",
			strokeWidth: 2,
			fontSize: font_size,
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
				document.getElementById('handwritten').remove();
				document.getElementsByClassName('notes-container')[0].style.opacity = 1;
				body.style = `
					background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #221e22, #141b25, #141b25, #141b25, #141b25);
					background-size: 400% 400%;
					background-position: 100% 50%;`;
			}
		})

		
	});
	


});