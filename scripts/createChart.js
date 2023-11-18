const table = document.querySelector('table');

function convertToTableCells(pointsList){
  let cells = '';
  for(let i = 0; i < pointsList.length; i++){
    if(i > 0 && pointsList[i-1] == pointsList[i])
      cells += `<td style="background-color: rgba(190, 190, 190, 0.75);"></td>`
    else
      cells += `<td>${pointsList[i]}</td>`
  }
  return cells;
}
for(let i = 4; i <= 18; i++){
  let row = '';
  row += `
    <tr>
      <td>${i}</td>
      ${convertToTableCells(noPangramData[i].points)}
    `;
    if(i >= 7){
      row += `${convertToTableCells(pangramData[i].points)}`;
    }
    else{
      for(let j = 0; j < 5; j++){
        row += '<td style="background-color: rgba(190, 190, 190, 0.75);"></td>'
      }
    }
    table.innerHTML += row+`</tr>`;
}
