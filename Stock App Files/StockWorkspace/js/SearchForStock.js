// Takes the input on button press and parses the string.
function UrlStringPass() {
    var input = document.getElementById("myInput").value;
    console.log("Search for Stock input: " + input);

    // Passes string input through URL
    window.location.href = "IndividualStockPage.html?stock=" + input + "#";
}

