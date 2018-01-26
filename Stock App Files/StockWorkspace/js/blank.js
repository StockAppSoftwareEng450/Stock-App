$(document).ready(
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user);

        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
);