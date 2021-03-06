

				// VIEW 

var view = {
	displayMessage: function (message) {
		var messageArea = document.getElementById ('messageArea');
		messageArea.innerHTML = message;
	},// commas needed!!! 

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
		},

	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},
	
			//sounds added!

	soundShot: function () {
		var audio = document.getElementsByTagName ("audio") [0];

		audio.volume = 0.1;
		audio.pause();
		audio.currentTime = 0;
		audio.play();
	},
	soundSink: function () {
		var sink =document.getElementById ("sink");

		audio.volume = 0.6;
		sink.pause();
		sink.currentTime = 0;
		sink.play();

	}

}

			// END VIEW

			// MODEL 

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3, 
	shipsSunk: 0,
	
				//ships deployed 

	ships: [
			{ locations: ["0", "0", "0"], hits: ["", "", ""] },
			{ locations: ["0", "0", "0"], hits: ["", "", ""] },
			{ locations: ["0", "0", "0"], hits: ["", "", ""] }
			],

					// fire function

	fire: function (guess) {
		setTimeout(view.soundShot,300);
		for (i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage('HIT!');
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
					setTimeout (view.soundSink,1600);
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	
					// if its hit and sunk

	isSunk: function (ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
				}
			}
			
			return true;
	},


generateShipLocations: function() {
	var locations;
	for (var i = 0; i < this.numShips; i++) {
		do {
			locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

				// ships generator


generateShip: function() {
	var direction = Math.floor(Math.random() * 2);
	var row, col;
	if (direction === 1) {
		row = Math.floor (Math.random() * this.boardSize);
		col = Math.floor (Math.random() * (this.boardSize - this.shipLength));
	} else {row = Math.floor (Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor (Math.random() * this.boardSize);
	}
	var newShipLocations = [];
	for (var i = 0; i < this.shipLength; i++) {
		if (direction === 1) {
			newShipLocations.push(row + "" + (col + i));
		} else {
			newShipLocations.push((row + i) + "" + col);
		}
	} return newShipLocations;
},

collision: function (locations) {
	for (var i = 0; i < this.numShips; i++) {
		var ship = model.ships[i];
		for (var j = 0; j < locations.length; j++) {
			if (ship.locations.indexOf (locations[j]) >= 0) {
				return true;
			}
		}
	} return false;
}

}; 

				//END MODEL



				//CONTROLLER

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + 
				this.guesses + " guesses");
		}
	}
	function parseGuess (guess) {
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
		if (guess === null || guess.length !== 2) {
			alert ("That was not a number and letter!");
			} else {
				firstChar = guess.charAt(0);
				var row = alphabet.indexOf(firstChar);
				var column = guess.charAt(1);
				if (isNaN(row) || isNaN(column)) {
					alert ("Where did it go, maaan!");
				} else if (row < 0 || row >= model.boardSize || column < 0 || column >=model.boardSize) {
					alert("Looks like you shot some asteroid in space, man!");
				} else {
					return row+column;
				}
			}
			return null;
		}
	}
}

				//CONTROLLER ENDS

				// event handler input form
function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton () {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13) {
		fireButton.click();
		return false;
	} 
}


window.onload = init;




					// CONTROLLER ENDS






