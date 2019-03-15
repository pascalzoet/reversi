Spa.Log = (function () {
    let init = function (message) {
        console.log(message);
        $("#loglist").append($("<li>").html(message));
    }

    return {
        init : init
    }
})();