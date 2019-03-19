Spa.Grafiek = (function () {

    let jsondata;
    let chart;
    let init = function (data) {
        jsondata = data;
    };

    let showGrafiek = function () {
        let ctx = document.getElementById('chart_stats').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['wit', 'zwart'],
                datasets: [{
                    label: 'aantal fiches',
                    data: [jsondata['PlayerWhiteScore'], jsondata['PlayerBlackScore']],
                    backgroundColor: [
                        'rgba(239, 237, 237, 1)',
                        'rgba(53, 51, 51, 1)',

                        
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        chart = myChart;
    };

    let update = function () {
        chart.destroy();
        showGrafiek();
    }

    return {
        init : init,
        toonGrafiek : showGrafiek,
        update: update
    }
})();