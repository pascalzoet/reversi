Spa.Api = (function () {
    let config = {
        key: '6f88e00d35ba36cb983f840f5d1b75db',
        url: 'https://api.openweathermap.org/data/2.5/weather',
        place: 'Zwolle'
    };

    let init = function (place) {
        config.place = place;
    };

    let GetWeather = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: config.url+'?q='+config.place+'&appid='+config.key,
                method : "get",
                success: function (response) {
                    resolve(response);
                }
            });
        })

    };

    return {
        init : init,
        weather : GetWeather
    }
})();