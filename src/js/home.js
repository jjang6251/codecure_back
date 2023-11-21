const singup = document.querySelector("#signup");
const login = document.querySelector("#login");
const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    console.log('click');
    fetch("/logout")
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
})