var autoURL = "https://api.iextrading.com/1.0/ref-data/symbols";

// Auto complete for search for stock
$.ajax({
    url: autoURL,
    success: function (data) {
        var options = {
            url: autoURL,
            // getValue: "name",
            getValue: function (element) {
                // console.log($(element).prop("name"));
                // console.log($(element).prop("symbol"));
                return $(element).prop("name") + " (" + $(element).prop("symbol") + ")";
            },
            template: {
                type: "custom",
                method: function(value) {
                    return value;
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

                    // console.log(value);

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
    // console.log("Search for Stock input: " + value);

    // Check for undefined value
    if (value === undefined ) {
        // Display error to the user and return user to homepage
        console.log("reached undefined");
        window.location.href = "index.html";
    }

    // Passes string input through URL
    window.location.href = "IndividualStockPage.html?stock=" + value + "#";
}

// Handling the enter button
function handle(e){
    if(e.keyCode === 13){
        e.preventDefault();

        let index1;
        let index2;
        let value = $("#myInput").val();
        
        // Just making sure its a string
        value = value.toString();

        // parse Alcoa Corporation (AA) to AA
        if (value.length > 6) {
            value = value.split("").reverse().join("");

            // Find whatever is between ) and (
            index1 = value.indexOf(")");
            index2 = value.indexOf("(");

            value = value.slice((index1 + 1), index2);

            // Now reverse the string that was previously reversed
            value = value.split("").reverse().join("");
        }

        // Making sure that the string is UpperCase
        value = value.toUpperCase();

        UrlStringPass(value);
    }
}

