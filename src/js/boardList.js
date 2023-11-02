 // 게시글 목록 데이터 (가상 데이터)
 const postList = document.getElementById("post-list");
 const postDetail = document.getElementById("post-detail");

 fetch('/boardList/api')
 .then(response => response.json())
 .then(data => {
    const posts = data.posts;
    posts.forEach(post => {
        const listItem = document.createElement("li");
        listItem.textContent = post.title;
        listItem.addEventListener("click", () => {
            // 선택한 게시글의 상세 내용을 표시합니다.
            showPostDetail(post);
        });
        postList.appendChild(listItem);
    });
 });

 // 게시글 목록을 동적으로 생성합니다.
 

 // 선택한 게시글의 상세 내용을 표시하는 함수
 function showPostDetail(post) {
     postDetail.innerHTML = `
         <h2>${post.title}</h2>
         <p>${post.content}</p>
     `;
 }