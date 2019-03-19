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
            }
        }).then(function () {
           return Spa.Data.loadgame()
        }).then(result => {
            if (result["response"]["status"] == "error") {
                var widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                widget.Load();
            } else {
                let data = JSON.parse(result['response']['data']);
                SetWhoIs(data["OnSet"])
                Spa.Reversi.buildgame(result["response"]["data"]);
                
            }
        }).then(function () {
            let poll = setInterval(() => {
                Spa.Data.loadgame().then(result => {
                    if(result["response"]["status"] == "error") {
                        let widget = new Widget(result["response"]["description"], "#widgetPlace", "warning");
                        widget.Load();
                        if (data['GameStatus'] == "finished") {
                            clearInterval(poll)
                        }
                    } else {
                        let data = JSON.parse(result['response']['data']);
                        let NewGrid = JSON.parse(data['Board']);
                        Spa.Reversi.update(NewGrid);
                        SetWhoIs(data["OnSet"])
                    }
                });
            }, 1500)
        }).then(function () {
           return Spa.Api.weather();
        }).then(result => {
                $("#advertisement > .place-title").html(result["name"])
                $("#advertisement > .temp").html(parseInt(result["main"]["temp"] - 273.15)+"&#8451;")
        }).then(function () {
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