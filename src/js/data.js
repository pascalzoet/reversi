Spa.Data = (function () {
    let configmap = {
        gametoken: null,
        env : "production"
    }

    let init = function (gametoken, env) {
        configmap.env = env;
        configmap.gametoken = gametoken;
    };

    let players = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/"+configmap.gametoken+"/players",
                method: "GET",
                success: function (response) {
                    resolve ({
                        name: "players",
                        response: response
                    })
                },
                error: function (xhr, error) {
                    reject({
                        name: "players",
                        response: xhr
                    })
                }
            })
        });
    }

    let GetGame = function () {
       //check if the board exist
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/"+configmap.gametoken,
                method: "GET",
                success: function (response) {
                    resolve({
                        name: "prep_board",
                        response: response
                    })
                },
                error : function (xhr, error) {
                    var widget = new Widget(xhr.responseText, "body", 'warning');
                    widget.Load();
                    reject( {
                        name: error,
                        response: error
                    })
                }
            })
        })
    }

    let pollGameStatus = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/"+configmap.gametoken,
                method: "GET",
                success: function (response) {
                    resolve( {
                        name: "game_state",
                        response: response
                    })
                },
                error : function (xhr, error) {
                    var widget = new Widget(xhr.responseText, "body", 'warning');
                    widget.Load();
                    reject( {
                        name: "game_state",
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
                    "GameToken": configmap.gametoken.toString()
                }),
                success: function (response) {
                    resolve({
                        name: "setmove",
                        response : response
                    })
                },
                error: function (xhr, error) {
                    reject( {
                        name: "setmove",
                        response: error
                    })
                }
            })
        })
    }

    return {
        init : init,
        GetPlayers: players,
        loadgame: GetGame,
        move : passmove

    }
})();