// 데이터를 테이블에 채우는 함수
function populateTable(data) {
    const tableBody = document.querySelector("#userData tbody");

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}&nbsp;&nbsp;&nbsp;</td>
        <td>${item.major}</td>
        <td>${item.stdid}&nbsp;&nbsp;</td>
        <td>${item.grade}</td>
        <td>${item.name}&nbsp;&nbsp;</td>
        <td>${item.role}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // 페이지 로드 시 데이터를 테이블에 채우기
  window.onload = function() {
    fetch("/memList")
    .then(response => response.json())
    .then(data => {
        populateTable(data);
    })
  };