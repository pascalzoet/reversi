const Reversi = function () {
	let config = {
		cols: 8,
		rows: 8
	}

	let turn = 1;

	let grid = [];

	let states = {
		'blank': { 'id' : 0, 'color': 'white' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' }
	}

	let prepareBoard = function () {
		//create the table where game takes place
		let table = document.createElement("table");

		//create a square board
		for (row = 0; row < config.rows; row++) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			grid[row] = [];
			for (col = 0; col < config.cols; col++) {
				 var td = document.createElement('td');

				 //create a stone
				 let stone = document.createElement("span");

				 stone.classList.add("stone");
				 stone.style.visibility = "hidden";

				 tr.appendChild(td);
				 td.appendChild(stone);

				 //bind the element to the grid
				 grid[row][col] = initItemState(stone);

				 bindMove(td, row, col);
			}
		}
		move(1, 3, 4);
		move(2, 3, 3);
		move(1, 4, 3);
		move(2, 4, 4);

		//apend the created table to the field
		document.getElementById("board").appendChild(table);
		whoIs();
	}

	 let initItemState = function(elem) {
        return {
            'state': states.blank,
            'elem': elem
        };
	}

	let bindMove = function (element, y, x) {
		element.onclick  = function (event) {
			//make sure only 1 stone can be placed at a specific spot
			if (isValidMove(y, x)) {
				move(turn, y, x);
				whoIs();
			}
		}
	}

	//Moves are valid when there is a stone from the oponent somewhere around the selected place
	//Horizontal, vertical and diagonal could be valid
	let isValidMove = function (row, col) {
		//check if the current spot is empty
		let posiblePositions = [];
		let whoIs;

		if (turn == 1) {
			whoIs = 2;
		} else {
			whoIs = 1;
		}

		for (rowDirection = -1; rowDirection <= 1; rowDirection++) {

			for (colDirection = -1; colDirection <= 1; colDirection++) {
				 // dont check the actual position
                if (rowDirection === 0 && colDirection === 0) {
                    continue;
				}

				let itemFound = false;
				rowCheck = row + rowDirection;
				colCheck = col + colDirection;


				while (isValidPosition(rowCheck, colCheck) && isVisible(rowCheck, colCheck) && grid[rowCheck][colCheck].state.id === turn) {

					// move to next position
					rowCheck += rowDirection;
					colCheck += colDirection;

					// item found
					itemFound = true; 
				}

				if (itemFound) {
					// now we need to check that the next item is one of ours
					if (isValidPosition(rowCheck, colCheck) && isVisible(rowCheck, colCheck) && grid[rowCheck][colCheck].state.id === whoIs) {
						// we have a valid move
						return true;
					}
				}
			}
		}
	}

	//Make sure that left or right is not outside the board
	let isValidPosition = function(row, col) {
        return (row >= 1 && row <= config.rows) && (col >= 1 && col <= config.cols);
	}


	//Make sure that there is not element on the selected place
	let isVisible = function (row, col) {
		if (grid[row][col].state.id == 0) {
			return false;
		} else {
			return true;
		}
	}

	//Move should only place the stone on the given place
	//No logic should be here
	//@param setter = black or white
	//@param y = the row in the grid
	//@param x = the col in given row
	let move = function (setter, y, x) {

		element = grid[y][x];
		if (setter == 1) {
			//black
			turn = 2;
			element.state = states.black;
			element.elem.classList.add("black");
		} else {
			//white
			turn = 1;
			element.state = states.white;
		}

		element.elem.style.visibility = 'visible';
	}

	let whoIs = function () {
		let who = "white";
		if (turn == 1) {
			who ="black";
		}
		document.getElementById("whois").innerHTML  = who;
	}

	return {
		init: prepareBoard
	}
}