/** Calculate if Stock Market is open **/
function stockMarketTime() {

    /** Only 9:30am - 4:00pm M-F **/
    var date = new Date();
    var today = date.getDay();

    if (today >= 1 && today <= 5) {

        // Determine the time
        var time = date.getHours();
        if (time >= 9 && time <= 16) {
            return "open";
        } else {
            return "closed";
        }

    } else {
        // console.log("Market closed");
        return "closed";
    }
}

/** Dynamic ToolTip **/
var cachedData = Array();
function hoverGetData(companyName) {
    var element = $(this);

    var id = element.data('id');

    if (id in cachedData) {
        return cachedData[id];
    }

    var localData = companyName;
    cachedData[id] = localData;

    return localData;
}

/** Setting Copyright footer at the bottom of every page **/
function setCopyrightTime() {
    let date = new Date();
    document.getElementById("Copyright").innerHTML = "Copyright @ stockApp " + date.getFullYear();
}


/** Unicode for UP and DOWN **/
var unicodeUp = '\u25B2';
var unicodeDown = '\u25BC';

// Adding color
unicodeUp = unicodeUp.fontcolor("green");
unicodeDown = unicodeDown.fontcolor("red");

