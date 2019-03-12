const Reversi = (function () {
	let config = {
		cols: 8,
		rows: 8
	};

	let grid;

	let turn = 1;

	let states = {
		'blank': { 'id' : 0, 'color': 'white' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' }
	};

	let initBoard = function () {
		Reversi.model.init()
		.then(result => {
			grid = JSON.parse(result['response']['board'])
		}).then(function () {
			prepareBoard();
		}).then(function () {
			updateBoard();
		});
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
				var checkState = grid[row][col];
				let state;
				switch (checkState) {
					case 0:
						stone.style.visibility = "hidden";
						state = states.blank;
						break;
					case 1:
						state = states.white;
						break;
					case 2:
						stone.classList.add("black");
						state = states.black;
						
				}

				tr.appendChild(td);
				td.appendChild(stone);
				grid[row][col] = initItemState(stone, state);

				//bind the element to the grid

				bindMove(td, row, col);
			}
		}
		//apend the created table to the field
		document.getElementById("board").appendChild(table);
	};

	let updateBoard = function () {
		setInterval(function()
		{ 
			Reversi.model.poll().then(result => {
				grid = JSON.parse(result['response']['board'])
				turn = JSON.parse(result["response"]["onSet"])
			}).then(function () {
				prepareBoard();
			});
		}
		, 1000);
	}

	let initItemState = function(elem, state) {
        return {
            'state': state,
            'elem': elem
        };
	};

	let bindMove = function (element, y, x) {
		element.onclick  = function (event) {
			Reversi.model.move(y, x);
		}
	};

	return {
		init : initBoard
	};
})();