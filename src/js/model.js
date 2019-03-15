Spa.Model = (function () {
    let init = function () {
        //setup the token and
        var url = window.location.href.toString(),
        access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
        Spa.Data.init(access_token, "production");
        load();
    };

    let load = function () {
        Spa.Data.GetPlayers().then(result => {
            if (result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                // var widget = new Widget(result["response"]["description"], "#widgetPlace");
                // widget.Load();
                
            }
        }).then(function () {
           return Spa.Data.loadgame()
        }).then(result => {
            if (result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                Spa.Reversi.buildgame(result["response"]["data"]);
                
            }
        }).then(function () {
            setInterval(() => {
                Spa.Data.loadgame().then(result => {
                    let NewGrid = JSON.parse(JSON.parse(result['response']['data'])['Board']);
                    Spa.Reversi.update(NewGrid);
                });
            }, 1500)
        })
    };

    let RequestMove = function (row, col) {
        Spa.Data.move(row, col).then(function (result) {
            let NewGrid = JSON.parse(JSON.parse(result['response']['data'])['Board']);
            Spa.Reversi.update(NewGrid)
        });
    }

    return {
        init: init,
        load: load,
        RequestMove : RequestMove
    }
})();