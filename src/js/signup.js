const deleteAll = document.querySelector("#deleteAll");

deleteAll.addEventListener("click", () => {
    const userconfirm = confirm('진짜로 명단을 모두 삭제하시겠습니까?');


    if(userconfirm){
        fetch("/memSignup/deleteAll")
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.error('Error:', error));
    }

    
});