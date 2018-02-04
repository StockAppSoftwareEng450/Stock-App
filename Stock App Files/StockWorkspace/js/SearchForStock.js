var autoURL = "https://api.iextrading.com/1.0/ref-data/symbols";

// Creating function outside to later pass to the search for stock
function AutoCompleteResult(value) {
    // Showing value on the click
    console.log(value);
}

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
                    AutoCompleteResult(value);
                    console.log(value);
                }
            }
        };
        $("#myInput").easyAutocomplete(options);
    }
});



// Takes the input on button press and parses the string.
function UrlStringPass() {
    var input = document.getElementById("myInput").value;
    console.log("Search for Stock input: " + input);

    // Passes string input through URL
    window.location.href = "IndividualStockPage.html?stock=" + input + "#";
}

