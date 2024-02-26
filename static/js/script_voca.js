//button_click and getbookdata
function getBookData() {
    var select = document.getElementById("select_option");
    var selectedOption = select.options[select.selectedIndex];
    var selectedValue = selectedOption.value;
    fetch('/vocabook=' + selectedValue)
        .then((response) => response.json())
        .then((book) => {

            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = ''; // 기존의 데이터 삭제
            let counter = 1;
            book.words.forEach((wordPair) => {
                const row = document.createElement("tr");
                const numberCell = document.createElement("th");
                numberCell.setAttribute("scope", "row");
                numberCell.textContent = counter;
                row.appendChild(numberCell);
                wordPair.forEach((value) => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
                counter++;
            });
        });
}

updateTable(selectedValue);