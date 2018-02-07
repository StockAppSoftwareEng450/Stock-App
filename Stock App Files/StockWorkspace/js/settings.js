document.getElementById('settingsForm').addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();

    //Get values
    var email = getInputVal('email');
    var password = getInputVal('password');
    var phone = getInputVal('phone');
    console.log(email);   
    console.log(password);
    console.log(phone);
}

//Function to get teh form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}

