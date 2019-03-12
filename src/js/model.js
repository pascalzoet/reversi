Reversi.model = (function () {
    let token = "SayjOq2ZwU6ZbiCwO78I0Q==";
    let init = function () {
        return PollBoard();
    };

    let PollBoard = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/"+token,
                method: "GET",
                success: function (response) {
                    resolve( {
                        name: "load_board",
                        response: response
                    })
                },
                error : function (error) {
                    reject( {
                        name: "load_board",
                        response: error
                    })
                }
            })
        })
    }

    let passmove = function (row, col) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/move",
                method: "PUT",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({
                    "moveX" : row, "moveY" : col,
                    "GameToken": token.toString()
                }),
                success: function (response) {
                    console.log(response);
                    resolve({
                        name: "setmove",
                        response : response
                    })
                }
            })
        })
    }

    return {
        init : init,
        move : passmove,
        poll : PollBoard
    }
})();