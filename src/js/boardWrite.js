
const postForm = document.getElementById("post-form");
const title = document.querySelector("#title");
const content = document.querySelector("#content");

// 게시글 목록을 동적으로 생성합니다.
function renderPostList() {
    postList.innerHTML = "";
    posts.forEach(post => {
        const listItem = document.createElement("li");
        listItem.textContent = post.title;
        listItem.addEventListener("click", () => {
            // 선택한 게시글의 상세 내용을 표시합니다.
            showPostDetail(post);
        });
        postList.appendChild(listItem);
    });
}

// 게시글을 작성하는 함수
function addPost(title, content) {
    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content
    };
    posts.push(newPost);
    renderPostList();
    showPostDetail(newPost);
}

// 게시글 작성 폼 제출 이벤트 처리
postForm.addEventListener("submit", function(event) {
    const type = document.querySelector("#board").value;
    event.preventDefault();
    const request = {
        title: title.value,
        content: content.value,
        type: type
    };
    
    if (title && content) {
        fetch('/boardWrite', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
    }
    console.log(request);
    // 폼 초기화
    postForm.reset();
    window.location.href = "/boardList";
    
});

// 선택한 게시글의 상세 내용을 표시하는 함수
function showPostDetail(post) {
    postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
    `;
}