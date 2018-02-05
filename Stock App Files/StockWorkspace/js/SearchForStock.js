var autoURL = "https://api.iextrading.com/1.0/ref-data/symbols";

// Auto complete for search for stock
$.ajax({
    url: autoURL,
    success: function (data) {
        var options = {
            url: autoURL,
            getValue: "name",
            template: {
                type: "custom",
                method: function(value, item) {
                    return value + "  (" + item.symbol + ")";
                }
            },
            list: {
                match: {
                    enabled: true
                },
                onClickEvent: function() {
                    var value = $("#myInput").getSelectedItemData().symbol;

                    // Check for undefined value
                    if (value === undefined ) {
                        // Display error to the user and return user to homepage
                        console.log("reached undefined");
                        window.location.href = "index.html";
                    }

                    console.log(value);

                    UrlStringPass(value);
                    //console.log(value);
                }
            }
        };
        $("#myInput").easyAutocomplete(options);
    }
});



// Takes the input on button press and parses the string.
function UrlStringPass(value) {
    console.log("Search for Stock input: " + value);

    // Check for undefined value
    if (value === undefined ) {
        // Display error to the user and return user to homepage
        console.log("reached undefined");
        window.location.href = "index.html";
    }


    // Passes string input through URL
    window.location.href = "IndividualStockPage.html?stock=" + value + "#";
}

