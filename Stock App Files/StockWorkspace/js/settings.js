"use strict";

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //fill input fields with values
            var ref = firebase.database().ref("Users");
            ref.orderByKey().equalTo(user.uid).once("value", function(snapshot) {
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        document.getElementById("email").value =  user.email;
                        document.getElementById("fstName").value = value.val().firstName;
                        document.getElementById("lstName").value = value.val().lastName;
                        document.getElementById("phone").value = value.val().phone;
                        document.getElementById("currency").value = value.val().currency;
                        document.getElementById("ubPortfolio").value = value.val().upperBoundPortfolio;
                        document.getElementById("ubPortfolioText").value = value.val().upperBoundPortfolio;
                        document.getElementById("lbPortfolio").value = value.val().lowerBoundPortfolio;
                        document.getElementById("lbPortfolioText").value = value.val().lowerBoundPortfolio;
                        document.getElementById("ubWatchlist").value = value.val().upperBoundWatchlist;
                        document.getElementById("ubWatchlistText").value = value.val().upperBoundWatchlist;
                        document.getElementById("lbWatchlist").value = value.val().lowerBoundWatchlist;
                        document.getElementById("lbWatchlistText").value = value.val().lowerBoundWatchlist;
                    });
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
});

// Listen for form sumbit
document.getElementById('settingsForm').addEventListener('submit', submitForm);

// Sumbit form
function submitUserForm(){
    //Get values
    var email = getInputVal('email');
    var password = getInputVal('password');
    var confirmPass = getInputVal('confirmPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    var checkedArray = checkUserVals(email, password, confirmPass);
    console.log("checked values: " + checkedArray);

    /** INVALID EMAIL MESSAGE TO USER**/
    if (checkedArray[0] === false ){
        document.querySelector('.email-invalid ').style.display = 'block';
        console.log("showing email alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.email-invalid ').style.display = 'none';
        }, 5000);
    }

    /** INVALID PASSWORD MESSAGE TO USER**/
    if (checkedArray[1] === false ){
        document.querySelector('.password-invalid').style.display = 'block';
        console.log("showing password alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.password-invalid').style.display = 'none';
        }, 5000);
    }

    if (checkedArray[0] !== false && checkedArray[1] !== false) {

        // Calling send function to pass checked values to the array
        sendUser(checkedArray[0], checkedArray[1]);
    }
}

// Function to check if all values are correct
function checkUserVals (email, password, confirmPass) {
    var array = [email, password, confirmPass];

    // Checked values return false if all criteria are not met
    var emailChecked, passwordChecked, confirmPassChecked = null;

    /** EMAIL CHECKING **/
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailRegexResult = emailRegex.test(email);
    //console.log("emailRegexResult: " +  emailRegexResult);

    if (emailRegexResult === false){
        emailChecked = false;
    } else {
        emailChecked = email;
    }

    console.log("emailChecked " + emailChecked);

    /** PASSWORD **/
    var passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;  // Minimum 8 chars, 1 num, 1 upper, 1 lower
    var passRegexResult = passRegex.test(password);
    //console.log("passRegexResult: " + passRegexResult);

    if (passRegexResult === false){
        passwordChecked = false;
    } else {
        passwordChecked = password;
    }

    console.log("passwordChecked" + passwordChecked );

    /** CONFIRM PASSWORD **/
    // If checked Regex password is the same as the checked Regex Confirm Password
    if (passwordChecked === confirmPass){
        passwordChecked = password;
        confirmPassChecked = confirmPass;
    } else {
        passwordChecked = false;
        confirmPassChecked = false;
        //console.log("setting checked passwords against each other to false");
    }

    console.log("passwordChecked" + passwordChecked);
    console.log("confirmPassChecked" + confirmPassChecked );

    // Return checked array
    array = [emailChecked, passwordChecked, confirmPassChecked];

    return array;

}

// Function to send the correct values to firebase
function sendUser(email, password) {
    // Get current Firebase user
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                password
            );

            // Prompt the user to re-provide their sign-in credentials
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                if(email !== false){
                    user.updateEmail(email).then(function() {
                        // Update successful.
                        console.log("Email Update successful")
                    }).catch(function(error) {
                        // An error happened.
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        // Consoling error messages
                        console.log(errorCode);
                        console.log(errorMessage);
                    });
                }

                if(password !== false){
                    user.updatePassword(password).then(function() {
                        // Update successful.
                        console.log("Password Update successful")
                    }).catch(function(error) {
                        // An error happened.
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        // Consoling error messages
                        console.log(errorCode);
                        console.log(errorMessage);
                    });
                }
            }).catch(function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;

                // Consoling error messages
                console.log(errorCode);
                console.log(errorMessage);
            });


            // show alert
            document.querySelector('.successful-register').style.display = 'block';

        } else {
            // No user is signed in.
        }
    });
}

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var fstName = getInputVal('fstName');
    var lstName = getInputVal('lstName');
    var phone = getInputVal('phone');

    var dropdown = document.getElementById("currency");
    var currency = dropdown.options[dropdown.selectedIndex].value;

    var ubPortfolio = getInputVal('ubPortfolioText');
    var lbPortfolio = getInputVal('lbPortfolioText');
    var ubWatchlist = getInputVal('ubWatchlistText');
    var lbWatchlist = getInputVal('lbWatchlistText');


    // Passing values that need to be checked to a function that returns whether they are correct or not.
    var checkedArray = checkVals(fstName, lstName, phone, currency, ubPortfolio, lbPortfolio, ubWatchlist, lbWatchlist);
    console.log("checked values: " + checkedArray);

    /** INVALID NAME MESSAGE TO USER**/
    if (checkedArray[0] === false || checkedArray[1] === false){
        document.querySelector('.name-invalid').style.display = 'block';
        console.log("showing naming alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.name-invalid').style.display = 'none';
        }, 5000);
    }

    /** INVALID PHONE MESSAGE TO USER**/
    if (checkedArray[2] === false ){
        // show phone alert
        document.querySelector('.alert-message-valid-phone').style.display = 'block';
        console.log("showing phone alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.alert-message-valid-phone').style.display = 'none';
        }, 5000);
    }

    /** ADD INVALID Currency, upper & lower Bound MESSAGE TO USER **/

    if (checkedArray[0] !== false && checkedArray[1] !== false &&
        checkedArray[2] !== false && checkedArray[3] !== false &&
        checkedArray[4] !== false && checkedArray[5] !== false &&
        checkedArray[6] !== false && checkedArray[7] !== false) {

        // Calling send function to pass checked values to the array
        send(checkedArray[0], checkedArray[1], checkedArray[2], checkedArray[3], checkedArray[4], checkedArray[5], checkedArray[6], checkedArray[7], checkedArray[8]);
    }
}

// Function to check if all values are correct
function checkVals (fstName, lstName, phone, currency, ubPortfolio, lbPortfolio, ubWatchlist, lbWatchlist) {
    var array = [fstName, lstName, phone, currency, ubPortfolio, lbPortfolio, ubWatchlist, lbWatchlist];

    // Checked values return false if all criteria are not met
    var fstNameChecked, lstNameChecked, phoneChecked, currencyChecked, ubPortfolioChecked, lbPortfolioChecked, ubWatchlistChecked, lbWatchlistChecked = null;

    /** NAME CHECKING **/

        // Calculating the len of first and last name does not exceed 40 chars
    var fstNameLen = fstName.length;
    var lstNameLen = lstName.length;
    var nameLenResult = fstNameLen + lstNameLen + 1;    // Adding 1 to account for the space in between the name

    var fullNameRegex = /^(([A-Za-z]+[\-']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-']?)*([A-Za-z]+)?$/;
    var NameRegexResult = fullNameRegex.test(fstName + " " + lstName);
    //console.log("fullNameRegexResult: " + NameRegexResult);

    // Check to see if user forgot name
    if (fstNameLen === 0  || lstNameLen === 0){
        fstNameChecked = false;
        lstNameChecked = false;
    } else {
        if (NameRegexResult === false || nameLenResult > 40 ) {
            fstNameChecked = false;
            lstNameChecked = false;
        } else {
            fstNameChecked = fstName;
            lstNameChecked = lstName;
        }
    }

    console.log("fstNameChecked " + fstNameChecked);
    console.log("lstNameChecked " + lstNameChecked);

    /** PHONE CHECKING **/
    var phoneLen = phone.length;

    var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var phoneRegexResult = phoneRegex.test(phone);
    //console.log("phoneRegexResult: " + phoneRegexResult);

    // Check for ten numbers
    if (phoneRegexResult === false || phoneLen !== 10){
        phoneChecked = false;
    } else {
        phoneChecked = phone;
    }

    console.log("phoneChecked " + phoneChecked);

    /** CURRENCY CHECKING **/
    // Check for a currency
    if (currency === null){
        currencyChecked = false;
    } else {
        currencyChecked = currency;
    }

    console.log("currencyChecked " + currencyChecked);

    /** Upper Bound Portfolio CHECKING **/
    // Check for between 0 and 100

    if (isNaN(ubPortfolio) || (ubPortfolio<0 || ubPortfolio>100)){
        ubPortfolioChecked = false;
    } else {
        ubPortfolioChecked = ubPortfolio;
    }

    console.log("ubPortfolioChecked " + ubPortfolioChecked);

    /** Lower Bound Portfolio CHECKING **/
    // Check for between 0 and 100

    if (isNaN(lbPortfolio) || (lbPortfolio<0 || lbPortfolio>100)){
        lbPortfolioChecked = false;
    } else {
        lbPortfolioChecked = lbPortfolio;
    }

    console.log("lbPortfolioChecked " + lbPortfolioChecked);

    /** Upper Bound Watchlist CHECKING **/
    // Check for between 0 and 100

    if (isNaN(ubWatchlist) || (ubWatchlist<0 || ubWatchlist>100)){
        ubWatchlistChecked = false;
    } else {
        ubWatchlistChecked = ubWatchlist;
    }

    console.log("ubWatchlistChecked " + ubWatchlistChecked);

    /** Lower Bound Watchlist CHECKING **/
    // Check for between 0 and 100

    if (isNaN(lbWatchlist) || (lbWatchlist<0 || lbWatchlist>100)){
        lbWatchlistChecked = false;
    } else {
        lbWatchlistChecked = lbWatchlist;
    }

    console.log("lbWatchlistChecked " + lbWatchlistChecked);

    // Return checked array
    array = [fstNameChecked, lstNameChecked, phoneChecked, currencyChecked, ubPortfolioChecked, lbPortfolioChecked, ubWatchlistChecked, lbWatchlistChecked];

    return array;
}

// Function to send the correct values to firebase
function send(fstName, lstName, phone, currency, ubPortfolio, lbPortfolio, ubWatchlist, lbWatchlist) {

    // Get current Firebase user
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            // Save message
            saveMessage(user.uid, fstName, lstName, phone, currency, ubPortfolio, lbPortfolio, ubWatchlist, lbWatchlist);

            // show alert
            document.querySelector('.successful-register').style.display = 'block';

        } else {
            // No user is signed in.
        }
    });
}

// Save message to firebase
function saveMessage(userId, fstName, lstName, phone, currency, ubPortfolio, lbPortofolio, ubWatchlist, lbWatchlost){
    firebase.database().ref('Users/' + userId).set({
        firstName: fstName,
        lastName: lstName,
        phone: phone,
        currency: currency,
        upperBoundPortfolio: ubPortfolio,
        lowerBoundPortfolio: lbPortofolio,
        upperBoundWatchlist: ubWatchlist,
        lowerBoundWatchlist: lbWatchlost
    });

    console.log("Sent");
}

//Function to get the form values
function getInputVal(id) {
    //returns value of id
    return document.getElementById(id).value;
}


// Update the upper bound portoflio slider value (each time you drag the slider handle)
document.getElementById("ubPortfolio").oninput = function() {
    document.getElementById("ubPortfolioText").value = this.value;
};
// Update the upper bound portoflio number value
document.getElementById("ubPortfolioText").oninput = function() {
    document.getElementById("ubPortfolio").value = this.value;
};

// Update the lower bound portoflio slider value (each time you drag the slider handle)
document.getElementById("lbPortfolio").oninput = function() {
    document.getElementById("lbPortfolioText").value = this.value;
};
// Update the lower bound portoflio number value
document.getElementById("lbPortfolioText").oninput = function() {
    document.getElementById("lbPortfolio").value = this.value;
};

// Update the upper bound watchlist slider value (each time you drag the slider handle)
document.getElementById("ubWatchlist").oninput = function() {
    document.getElementById("ubWatchlistText").value = this.value;
};
// Update the upper bound watchlist number value
document.getElementById("ubWatchlistText").oninput = function() {
    document.getElementById("ubWatchlist").value = this.value;
};

// Update the lower bound watchlist slider value (each time you drag the slider handle)
document.getElementById("lbWatchlist").oninput = function() {
    document.getElementById("lbWatchlistText").value = this.value;
};
// Update the lower bound watchlist number value
document.getElementById("lbWatchlistText").oninput = function() {
    document.getElementById("lbWatchlist").value = this.value;
};

