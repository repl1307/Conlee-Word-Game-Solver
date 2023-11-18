class Score {
  constructor(points, maxLength=6){
    this.points = points;
    for(let i = 1; i < this.points.length; i++){
      if(this.points[i] == null)
        this.points[i] = this.points[i-1];
    }
    while(this.points.length < maxLength){
      this.points.push(this.points.at(-1)+5);
    }
  }
}
const noPangramData = {
  4: new Score([2, 7, 12, 17, null, null]),
  5: new Score([4, 9, 14, 19, 24, null]),
  6: new Score([6, 11, 16, 21, 26, null]),
  7: new Score([12, 17, 22]),
  8: new Score([15, 20]),
  9: new Score([18]),
  10: new Score([21]),
};
const pangramData = {
  7: new Score([24, null, null, null, null], 5),
  8: new Score([27, 32, null, null, null], 5),
  9: new Score([30, 35, 40, null, null], 5),
  10: new Score([33, 38, 43, 48, null], 5),
};
for(let i = 11; i <= 18; i++){
  noPangramData[i] = new Score([noPangramData[i-1].points[0]+3]);
  pangramData[i] = new Score([pangramData[i-1].points[0]+3], 5);
}
console.log(noPangramData);
console.log(pangramData);


