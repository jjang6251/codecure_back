 // 게시글 목록 데이터 (가상 데이터)
 const postList = document.querySelector("#post-list");

 fetch('/boardList/api')
 .then(response => response.json())
 .then(data => {
    const posts = data.posts;
    posts.forEach(post => {
        const row = document.createElement("tr");
        const cellId = document.createElement("td");
        const cellContent = document.createElement("td");
        const contentLink = document.createElement("a");
        const cellCount = document.createElement("td");
        const id = post.id;


        cellId.textContent = post.id;
        row.appendChild(cellId);

        contentLink.textContent = post.content;
        contentLink.href = `boardList/${id}`
        cellContent.appendChild(contentLink);
        row.appendChild(cellContent);


        cellCount.textContent = post.count;
        row.appendChild(cellCount);
        
        postList.appendChild(row);
        
    });
 });

 const tbodyElement = document.querySelector('tbody');

//  tbodyElement.addEventListener('click', (event) => {
//    const clickedItem = event.target;
//    if (clickedItem.tagName === 'td') {
//      const postId = clickedItem.dataset.id;
//      window.location.href = `/boardList/${postId}`;
//    }
//  });