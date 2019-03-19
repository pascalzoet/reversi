Spa.Reversi = (function () {
	let config = {
		cols: 8,
		rows: 8,
		movex : null,
		movey : null
	};

	let CurrentGrid;
	let states = {
		'blank': { 'id' : 0, 'color': 'white' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' }
	};

	let init = function (grid, x, y) {
		CurrentGrid = JSON.parse(JSON.parse(grid)["Board"]);
		prepareBoard();
	}

	let prepareBoard = function () {
		//Retrieve the board from the api
		//create the table where game takes place
		document.getElementById("board").innerHTML = "";
		let table = document.createElement("table");
		// //create a square board
		for (let row = 0; row < config.rows; row++) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			for (let col = 0; col < config.cols; col++) {
				var td = document.createElement('td');

				//create a stone
				let stone = document.createElement("span");

				stone.classList.add("stone");
				stone.classList.add("animate");

				var checkState = CurrentGrid[row][col];
				let state;
				switch (checkState) {
					case 0:
						stone.style.visibility = "hidden";
						state = states.blank;
						break;
					case 1:
						state = states.white;
						stone.classList.add("white");

						break;
					case 2:
						stone.classList.add("black");
						state = states.black;
						
				}

				tr.appendChild(td);
				td.appendChild(stone);
				CurrentGrid[row][col] = initItemState(stone, state);

				//bind the element to the grid
				stone.classList.toggle("animate");

				bindMove(td, row, col);
			}
		}
		//apend the created table to the field
		document.getElementById("board").appendChild(table);
	};

	let updateBoard = function (NewGrid, setx, sety) {
		for (let row = 0; row < config.rows; row++) {
			for (let col = 0; col < config.cols; col++) {
				while (CurrentGrid[row][col].state.id != NewGrid[row][col]) {
					CurrentGrid[row][col].elem.style.visibility = "visible";

					if (NewGrid[row][col] == 1) {
						CurrentGrid[row][col].state = states.white;
						CurrentGrid[row][col].elem.classList.remove("black");
						CurrentGrid[row][col].elem.classList.add("white");
					} else if (NewGrid[row][col] == 2) {
						CurrentGrid[row][col].state = states.black;
						CurrentGrid[row][col].elem.classList.add("black");
						CurrentGrid[row][col].elem.classList.remove("white");

					}

					if (row == setx && col == sety) {
						// do nothing
					} else {
						if (NewGrid[row][col] == 1) {
							CurrentGrid[row][col].elem.classList.add('animate-white')

						} else if (NewGrid[row][col] == 2) {
							CurrentGrid[row][col].elem.classList.add('animate-black')
						}
					}
				}
			}
		}
	};

	let initItemState = function(elem, state) {
        return {
            'state': state,
            'elem': elem
        };
	};

	let bindMove = function (element, y, x) {
		element.onclick  = function (event) {
			Spa.Model.RequestMove(y, x);
		}
	};

	let whois = function (who) {
		if (who == 1) {
			document.getElementById("whois").innerHTML = "wit is aan zet";
		} else {
			document.getElementById("whois").innerHTML = "zwart is aan zet";
		}
	}

	return {
		buildgame : init,
		update: updateBoard
	};
})();