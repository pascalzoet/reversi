Spa.Reversi = (function () {
	let config = {
		cols: 8,
		rows: 8
	};

	let CurrentGrid;
	let states = {
		'blank': { 'id' : 0, 'color': 'white' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' }
	};

	let init = function (grid) {
		CurrentGrid = JSON.parse(JSON.parse(grid)["Board"]);
		prepareBoard();
		//check if both players are here
		// //call the api to check if the server is available
		// Reversi.model.init().then(result => {
		// 	//based on the given result
		// 	CurrentGrid = JSON.parse(result["response"]['board']);
		// 	whois(result["response"]["onSet"]);
		// 	switch (result['response']['gameStatus']) {
		// 		case "waiting":
		// 			//waiting for second player
		// 			break;
		// 		case "inprogress":
		// 			//game has started
		// 			config.started = true;
		// 			break;
		// 		case "finished":
		// 			config.finished = true;
		// 			break;
		// 			//game has finished
		// 	}
		// }).then(function() {
		// 	prepareBoard();
		// })
		// .then(function () {
		// 	if (config.finished == true) {
		// 		//game is over
		// 	} else if(config.started == false) {
		// 		//game has not started, poll the game states for our second teammate
		// 		var widget = new Widget("wachten op tegenstander", "#widgetPlace", 'warning');
		// 		widget.Load();
		// 		PollOponentStatus();
		// 	} else {
		// 		//game is in progress, keep updating
		// 		PollForGameUpdate();
		// 	}
		// })
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

	let updateBoard = function (NewGrid) {
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
				}
			}
		}
	};

	let PollForGameUpdate = function () {
	
		setInterval(function()
		{ 
			Reversi.model.poll().then(result => {
				NewGrid = JSON.parse(result['response']['board'])
				whois(result["response"]["onSet"]);
			}).then(function () {
				updateBoard();
			});
		}
		, 1500);
	}

	let PollOponentStatus = function () {
		var widget = new Widget("tegenstander gevonden", "#widgetPlace");
		let status = setInterval(function () {
			 Reversi.model.polStatus().then(result => {
				if (result['response'].gameStatus != "waiting") {
					//start the game
					clearInterval(status);
					NewGrid = JSON.parse(result["response"]["board"]);
					widget.Load();
					PollForGameUpdate();
				}
			})
		}, 1500)
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