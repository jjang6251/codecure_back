const id = document.querySelector("#id");
const password = document.querySelector("#password");
const loginButton = document.querySelector("button");

loginButton.addEventListener("click", login);

function login() {
    const request = {
        id : id.value,
        password : password.value,
    };
    console.log(request);
}

fetch('login', {
    method: "POST",
    headers: {
        "Content-Type": "application/jason"
    },
    body: JSON.stringify(request)
});