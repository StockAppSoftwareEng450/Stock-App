"use strict";

//Logout a current user
firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Sign-out successful.")
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
});

// Listen for form sumbit
document.getElementById('registerForm').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var fstName = getInputVal('fstName');
    var lstName = getInputVal('lstName');
    var email = getInputVal('email');
    var phone = getInputVal('phone');
    var password = getInputVal('password');
    var confirmPass = getInputVal('confirmPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    var checkedArray = checkVals(fstName, lstName, email, phone, password, confirmPass);
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

    /** INVALID EMAIL MESSAGE TO USER**/
    if (checkedArray[2] === false ){
        document.querySelector('.email-invalid ').style.display = 'block';
        console.log("showing email alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.email-invalid ').style.display = 'none';
        }, 5000);
    }

    /** INVALID PHONE MESSAGE TO USER**/
    if (checkedArray[3] === false ){
        // show phone alert
        document.querySelector('.alert-message-valid-phone').style.display = 'block';
        console.log("showing phone alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.alert-message-valid-phone').style.display = 'none';
        }, 5000);
    }

    /** INVALID PASSWORD MESSAGE TO USER**/
    if (checkedArray[4] === false ){
        document.querySelector('.password-invalid').style.display = 'block';
        console.log("showing password alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.password-invalid').style.display = 'none';
        }, 5000);
    }

    if (checkedArray[0] !== false && checkedArray[2] !== false &&
        checkedArray[3] !== false && checkedArray[4] !== false) {

        // Calling send function to pass checked values to the array
        send(checkedArray[0], checkedArray[1], checkedArray[2], checkedArray[3], checkedArray[4], checkedArray[5]);
    }

}

// Function to check if all values are correct
function checkVals (fstName, lstName, email, phone, password, confirmPass) {
    var array = [fstName, lstName, email, phone, password, confirmPass];

    // Checked values return false if all criteria are not met
    var fstNameChecked, lstNameChecked, emailChecked, phoneChecked, passwordChecked, confirmPassChecked = null;

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

    /** EMAIL CHECKING **/
    var emailRegex = /q[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    var emailRegexResult = emailRegex.test(email);
    //console.log("emailRegexResult: " +  emailRegexResult);

    if (emailRegexResult === false){
        emailChecked = false;
    } else {
        emailChecked = email;
    }

    console.log("emailChecked " + emailChecked);

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
    array = [fstNameChecked, lstNameChecked, emailChecked, phoneChecked, passwordChecked, confirmPassChecked];

    return array;
}

// Function to send the correct values to firebase
function send(fstName, lstName, email, phone, password, confirmPass) {

    // Create Firebase User + Login
    createUserAndLogin(email, password);

    // Get current Firebase user
    var user1 = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            // Save message
            saveMessage(user.uid, fstName, lstName, phone);

            // show alert
            document.querySelector('.successful-register').style.display = 'block';

            //hide alert after 3 seconds
            setTimeout(function(){
                document.querySelector('.successful-register').style.display = 'none';
                window.location.href = "index.html";
            }, 3000);

            // Clear Form
            document.getElementById('registerForm').reset();
        } else {
            // No user is signed in.
        }
    });
}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(userId, fstName, lstName, phone){
    firebase.database().ref('Users/' + userId).set({
        firstName: fstName,
        lastName: lstName,
        phone: phone,
        currency: "USD",
        upperBoundPortfolio: 15,
        lowerBoundPortfolio: 5,
        upperBoundWatchlist: 20,
        lowerBoundWatchlist: 10
    });

    console.log("Sent");
}

// create a user but not login
// returns a promise
function createUser(email, password) {
    var deferred = $.Deferred();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        // Consoling error messages
        console.log(errorCode);
        console.log(errorMessage);

        // Email already in Use
        if (errorCode = "auth/email-already-in-use"){
            // show email alert
            document.querySelector('.email-registered').style.display = 'block';

            //hide alert after 5 seconds
            setTimeout(function(){
                document.querySelector('.email-registered').style.display = 'none';
            }, 5000);
        }


    });

    return deferred.promise();
}

// Create a user and then login in
// returns a promise
function createUserAndLogin(email, password) {
    return createUser(email, password)
        .then(function () {
            return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                // ...
            });
        });
}

