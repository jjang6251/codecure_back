const title = document.querySelector("#title");
const content = document.querySelector("#content");
const updateButton = document.querySelector("#update");

const currentURL = window.location.href;
const pathArray = window.location.pathname.split('/');
const postId = pathArray[pathArray.length - 1];

// fetch(`/loadDatabase/${postId}`)
// .then(response => response.json())
// .then(data => {
//     const dataTitle = data.title;
//     const dataContent = data.content;
//     title.value = dataTitle;
//     content.value = dataContent;
// });


fetch(`/loadDatabase/${postId}`)
.then(response => response.json())
.then(data => {
    const dataTitle =  data.content;
    const dataContent =  data.content;
    title.value =  dataTitle;
    content.value =  dataContent;
});



updateButton.addEventListener("click", async () => {
    // 버튼 비활성화
    updateButton.disabled = true;

    try {
        const request = {
            title: title.value,
            content: content.value,
        };

        await fetch(`/boardUpdate/api/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if(data === "Success"){
                window.location.href = "/boardList";
            }
        })

        // 업데이트 성공 시 리다이렉션
        
    } catch (error) {
        console.error('오류 발생:', error);
        // 오류 처리 로직 추가
    } finally {
        // 비동기 작업 완료 후 버튼 활성화
        updateButton.disabled = false;
    }
});