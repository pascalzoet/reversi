Spa.Grafiek = (function () {

    let jsondata;

    let init = function (data) {
        jsondata = data;
    };

    let showGrafiek = function () {
        console.log(jsondata);
        var ctx = document.getElementById('statschart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['wit', 'zwart'],
                datasets: [{
                    label: 'aantal fiches',
                    data: [jsondata['PlayerWhiteScore'], jsondata['PlayerBlackScore']],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };

    return {
        init : init,
        toonGrafiek : showGrafiek
    }
})();