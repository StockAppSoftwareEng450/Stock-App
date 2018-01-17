// function myFunction() {
//     var input, filter, ul, li, a, i;
//     input = document.getElementById("myInput");
//     console.log(input);
//     filter = input.value.toUpperCase();
//     ul = document.getElementById("myUL");
//     li = ul.getElementsByTagName("li");
//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByTagName("a")[0];
//         if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
//
//     /*************************** FIX ME ****************************************************/
//     //Right now the filter returns, every key press. I need the filter to only return valid
//     // symbols and company. Right now if the client searches the same stock twice the
//     // the search bar returns twice.
//
//     //Returning the result
//     console.log(filter);
//
//     /**************************** Fix Me *************************************************/
//
//     var parser = document.createElement('a');
//     //End result should look like: https://api.iextrading.com/1.0/stock/VNOM/quote
//     parser.href = "https://api.iextrading.com/1.0/stock/";
//
//     parser.StockName = filter;
//     console.log("Parser StockName: " + parser.StockName);
//
//     var url = parser.href;
//     var stockName = parser.StockName;
//     var result = url + stockName;
//
//     //concat quote to the end of the url
//     var quoteAdd = "/quote";
//     result = result + quoteAdd;
//     console.log("quote: " + quoteAdd);
//     console.log("Final url: " + result);
//
//     //counting letters in the filter
//     var count = filter.replace(/[^A-Z]/gi, "").length;
//     console.log(count);
//     if (count === 2 || count === 3 || count === 4 && filter) {
//         if ($("#myUL").length) {
//             console.log("nested if result: " + result);
//             var resultDiv = "<li><a href=" + "'" + result + "'" + ">" + filter + "</a></li>";
//             $("#myUL").append(resultDiv);
//             console.log(resultDiv);
//
//         }
//     }
//     return result;
// }

function UrlStringPass() {
    console.log("reached UrlStringPass")
}
