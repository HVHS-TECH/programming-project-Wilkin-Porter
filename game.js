/*******************************************************/
// P5.play: game.js
// Vacuuming Simulator Main Script
// Written by Wilkin Porter - Term 1 2026
/*******************************************************/
	
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");
	cnv = new Canvas(windowWidth -4,  windowHeight -4);
	player = new Sprite(width/2, height/2, 120, 60);
	player.color = 'cyan';
	player.rotation = 270;
	player.direction = 270;
	player.text = "Front >";
    player.textSize = 40;
    player.textColor = 'white';
}
	
/*******************************************************/
// draw()
/*******************************************************/

function draw() {
	background('lightgrey'); 

	if (kb.pressing('left')) {
		player.direction = player.direction - 1;
	}

	if (kb.pressing('right')) {
		player.direction = player.direction + 1;
	};
	
	player.rotation = player.direction;

	if (kb.pressing('up')) {
		player.speed = 5;
	};

	if (kb.pressing('down')) {    
		player.speed = -5;
	};

	if (kb.released('up')) {    
		player.speed = 0;
	};

	if (kb.released('down')) {    
		player.speed = 0;
	};
}

/*******************************************************/
//  END OF APP
/*******************************************************/