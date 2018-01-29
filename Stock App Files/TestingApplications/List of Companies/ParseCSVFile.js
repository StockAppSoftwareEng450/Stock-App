// Function that Grabs text and sets the Cookie and transfers user to the Display page
function buttonPress() {
    var input = document.getElementById("myText").value;
    console.log("input: " + input);
}

var data;

var file = "NASDAQ/companylistA.csv";
console.log(Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results;
        }
}));