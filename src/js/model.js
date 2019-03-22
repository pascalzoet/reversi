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
            //get all the players
            if (result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                var widget = new Widget(result["response"]["description"], "#widgetPlace");
                widget.Load();
                $(".you-are > span").html("Jij bent "+ result["response"]["data"])
            }
        }).then(function () {
            //request the game status
           return Spa.Data.loadgame()
        }).then(result => {

            //build the game
            if (result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                let data = JSON.parse(result['response']['data']);
                SetWhoIs(data["OnSet"])
                Spa.Reversi.buildgame(result["response"]["data"]);
                
            }
        }).then(function () {
            //keep polling the game
            let poll = setInterval(() => {
                Spa.Data.loadgame().then(result => {
                    let data = JSON.parse(result['response']['data']);

                    if(result["response"]["status"] == "error") {
                        let widget = new Widget(result["response"]["description"], "#widgetPlace", "warning", false);
                        widget.Load();
                        if (data['GameStatus'] == "finished") {
                            clearInterval(poll)
                            setInterval(() => {
                                location.href = "/dashboard";
                            }, 5000);
                        }
                    } else {
                        let NewGrid = JSON.parse(data['Board']);
                        Spa.Reversi.update(NewGrid);
                        SetWhoIs(data["OnSet"])
                    }
                });
            }, 1500)
        }).then(function () {
            //request weathers stats
           return Spa.Api.weather();
        }).then(result => {
            //build weather api stats
        }).then(function () {

            //get the stats for the chart
            Spa.Data.stats().then(function (result) {
                Spa.Grafiek.init(JSON.parse(result["response"]["data"]));
                Spa.Grafiek.toonGrafiek();
            });
        })
    };

    let RequestMove = function (row, col) {
        Spa.Data.move(row, col).then(function (result) {
            if(result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                let data = JSON.parse(result['response']['data'])
                let NewGrid = JSON.parse(result['response']["board"]);
                Spa.Reversi.update(NewGrid, data["MoveX"], data["MoveY"])

                Spa.Data.stats().then(function (result) {
                    Spa.Grafiek.init(JSON.parse(result["response"]["data"]));
                    Spa.Grafiek.update();
                });
                var widget = new Widget("steen gezet, wacht op tegenstander", "#widgetPlace");
                widget.Load();
            }
        });
    }

    let SetWhoIs = function (onset) {

        if (onset == 1) {
            $(".stone-block-white").show();
            $(".stone-block-white").toggleClass("rotate");
            $(".stone-block-black").hide();
        } else {
            $(".stone-block-black").toggleClass("rotate");
            $(".stone-block-white").hide();
            $(".stone-block-black").show();

        }
    }

    return {
        init: init,
        load: load,
        RequestMove : RequestMove
    }
})();