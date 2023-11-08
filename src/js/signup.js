const id =  document.querySelector("#id");
const password =  document.querySelector("#password");
const username =  document.querySelector("#username");
const signupButton = document.querySelector("button");

signupButton.addEventListener("click", signup);

function signup(){
    const request = {
        id : id.value,
        password: password.value,
        username: username.value,
    };
    console.log(request);

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request),
    });
    
    window.location.href = "/";
}