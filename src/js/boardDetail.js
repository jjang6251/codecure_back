const currentURL = window.location.href;
const pathArray = window.location.pathname.split('/');
const postId = pathArray[pathArray.length - 1];

const title = document.querySelector("#title");
const content = document.querySelector("#content");
const count = document.querySelector("#count");
const deleteButton = document.querySelector("#delete");
const updateButton = document.querySelector("#update");
const commentList = document.querySelector("#commentList");
const commentButton = document.querySelector("#commentButton");
const comment = document.querySelector("#comment");



fetch(`/boardList/${postId}/api`)
.then(response => response.json())
.then(data => {
    const dataTitle = data.title;
    const dataContent = data.content;
    const dataCount = data.count;
    title.innerHTML = dataTitle;
    content.innerHTML = dataContent;
    count.innerHTML = dataCount;
});

fetch(`/commentList/${postId}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    // 데이터가 배열인 경우
    if (Array.isArray(data)) {
      // 여러 댓글이 있는 경우 반복문 사용
      data.forEach(comment => {
        const comment_user_id = comment.comment_user_id;
        const comment_content = comment.comment_content;

        console.log(comment_user_id);
        console.log(comment_content);

        // 여러 댓글을 표시하려면 내용을 추가하는 방식으로 수정
        commentList.innerHTML += `<p>${comment_user_id}: ${comment_content}</p>`;
      });
    } else {
      // 데이터가 배열이 아니라면 단일 댓글 처리
      const comment_user_id = data.comment_user_id;
      const comment_content = data.comment_content;

      console.log(comment_user_id);
      console.log(comment_content);

      commentList.innerHTML += `<p>${comment_user_id}: ${comment_content}</p>`;
    }
  })
  .catch(error => console.error("Error fetching comments:", error));

commentButton.addEventListener("click", () =>{
    const request = {
        comment: comment.value,
    }
    console.log(request);
    fetch(`/comment/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
    })
    .then(data => {
        alert(data);
    });
    location.reload();
})



    deleteButton.addEventListener("click", () => {
        fetch(`/delete/${postId}`)
        .then(response => {
            if(response.ok) {
                return response.text();
            }
        })
        .then((data)=> {
            alert(data);
            if(data === "success"){
                window.location.href = "/boardList";
            }
        })  
    });

updateButton.addEventListener("click", () => {
    window.location.href = `/boardUpdate/${postId}`;
});