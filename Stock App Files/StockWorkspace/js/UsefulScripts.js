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
        console.log("closed");
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

var purchasedEquity = 1156 + 529;
var currentEquity = 5865.00 + 2109.79;