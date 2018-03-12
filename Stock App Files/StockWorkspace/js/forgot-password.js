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
        document.querySelector('.successful').style.display = 'block';
        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.successful').style.display = 'none';
            window.location.replace("index.html");
        }, 3000);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        if (errorCode === "auth/user-not-found"){
            document.querySelector('.user-not-found').style.display = 'block';
            console.log("User not found");

            // //hide alert after 5 seconds
            setTimeout(function(){
                document.querySelector('.user-not-found').style.display = 'none';
            }, 5000);
        }


    });

}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}