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
    
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then((response) => {
        if(response.ok) {
            return response.text();
        }
        throw new Error('네트워크 응답 실패');
    })
    .then((data) => {
        console.log(data);
        alert(data);
        if("success" === data){
            window.location.href = "/";
        }
    })
}

