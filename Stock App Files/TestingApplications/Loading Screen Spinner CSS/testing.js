// On ready function
function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}


function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

// Calling the onReady
onReady(function () {
    show('page', true);
    show('loading', false);
});
