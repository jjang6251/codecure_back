const title = document.querySelector("#title");
const content = document.querySelector("#content");
const updateButton = document.querySelector("button");

const currentURL = window.location.href;
const pathArray = window.location.pathname.split('/');
const postId = pathArray[pathArray.length - 1];

fetch(`/loadDatabase/${postId}`)
.then(response => response.json())
.then(data => {
    const dataTitle = data.title;
    const dataContent = data.content;
    title.value = dataTitle;
    content.value = dataContent;
});

updateButton.addEventListener("click", () => {
    const request = {
        title: title.value,
        content: content.value,
    };
    fetch(`/boardUpdate/api/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        if(data.success){
            console.log(data.success);
        }
    })
    .catch(error => {
        console.error('오류 발생:', error);
        // 오류 처리 로직 추가
      });
})