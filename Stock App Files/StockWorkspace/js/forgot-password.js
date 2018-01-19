"use strict";

// Listen for form sumbit
document.getElementById('forgotPasswordForm').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var email = getInputVal('email');

    //Send a password reset email
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Email sent.
        console.log("Email sent!");
        //On success forward to index.html
        window.location.replace("index.html");
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
    });

}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}