const newPassword = document.querySelector("#newPassword").value;
const checkPassword = document.querySelector("#checkPassword").value;
const checkButton = document.querySelector("button");


checkButton.addEventListener("submit", () => {
    if(newPassword != checkPassword){
        alert("비밀번호가 일치 하지 않음.");
    } else {
        const request = {
            password: newPassword
        }
        fetch("/modifyMem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
    }
})
