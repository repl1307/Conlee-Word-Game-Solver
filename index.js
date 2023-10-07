import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.static('public'));

app.get('/', (res, req) => {
  res.render('index');
});

app.post('/worddata', (req, res) => {
  console.log('Retrieving Word Data...');
  let words = [];
  fs.readFile('words.txt', (err, data) => {
    if(err){ throw err; }
    const wordData = data.toString();
    words = wordData.split('\n');
    console.log("Sending Word Data...")
    res.send(JSON.stringify(words));
  });
});

app.listen(3000);
