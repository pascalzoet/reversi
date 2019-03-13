Reversi.model = (function () {
    let configmap = {
        gametoken: null,
        turnUrl : null,
        env : "production"
    }


    let init = function (gametoken, env) {
        var url = window.location.href.toString(),
        access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
        configmap.env = env;
        configmap.gametoken = access_token;
        return PollBoard();
    };

    let PollBoard = function () {
        if (configmap.env == "development") {
            return new Promise(function (resolve, reject) {
                resolve( {
                    name: "load_board",
                    response: response
                })
            })
        } else {

        }
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://localhost:44375/api/game/"+configmap.gametoken,
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
                    "GameToken": configmap.gametoken.toString()
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