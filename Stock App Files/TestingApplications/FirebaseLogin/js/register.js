// https://firebase.google.com/docs/auth/web/password-auth
"use strict";

// Listen for form sumbit
document.getElementById('frmRegister').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var email = getInputVal('txtEmail');
    var password = getInputVal('txtPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    // var checkedArray = checkVals(fstName, lstName, email, phone, password, confirmPass);
    //console.log("checked values: " + checkedArray);

    // Calling send function to pass checked values to the array
    //createUserAndLogin(email, password);
    createUser(email, password);

    //add a Users table for additional user information!
}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}

// create a user but not login
// returns a promsie
function createUser(email, password) {
    var deferred = $.Deferred();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
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

