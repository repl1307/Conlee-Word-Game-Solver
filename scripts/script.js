const input = document.querySelector('input[type=text]');
const toggleMandatory = document.getElementById('toggle-mandatory')
const result = document.getElementById('result');
const submit = document.getElementById('submit');
const loadingContainer = document.querySelector('.loading-container');
const progressBar = document.querySelector('.progress-bar');
const select = document.querySelector('select');
const bonusLetterSelect = document.getElementById('bonus-letter');

//adding a -z in bonus letter dropdown
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
  const option = document.createElement('option');
  option.innerHTML = char.toUpperCase();
  bonusLetterSelect.appendChild(option);
});

//adding #'s 1 - 100 in dropdown
for(let i = 1; i <= 100; i++){
  const option = document.createElement('option');
  option.innerHTML = i;
  select.appendChild(option);
}

//webworker
const worker = new Worker('webworker.js');
worker.onmessage = (e) => {
  progressBar.style.width = e.data;
};
//event listeners
select.addEventListener('change', e => {
   console.log("User requested "+select.value+" word(s).");
});
input.addEventListener('keydown', e => {
  if(e.key == 'Enter'){
     handleInput();
  }
});
submit.addEventListener('click', e => {
   handleInput();
});

//word finding algorithm
async function getLongestWord(letters, bonusLetter, requireMandatoryLetter=false){
  //const data = await fetch('/worddata', { method: 'POST' })
  //const json = await data.json();
  const json = wordData.split('\n');
  await new Promise(res => setTimeout(res, 0));
  result.innerHTML = '<p style="text-align: left;">Loading...<p>';
  loadingContainer.style.display = 'block';
  progressBar.style.width = '0px';
  loadingContainer.scrollIntoView(false);
  let longestWord = [];
  //check if provided word matches letter criteria
  const matchesLetters = (word) => {
    let hasMandatoryLetter = false;
    //loop through each character of word, and compare to each letter of letters
    for(const char of word){
      //check if character has mandatory letter
      if(char == letters[0]){
        hasMandatoryLetter = true;
      }
      //check if character has any letter in letters
      let charIsValid = false;
      for(const letter of letters){
        if(char == letter){
          charIsValid = true;
        }
      }
      if(!charIsValid){
        return false;
      }
    }
    if(requireMandatoryLetter)
      return hasMandatoryLetter;
    else
      return true;
  };
  //gets points value of word
  const getPoints = word => {
    let points = 0;
    let bonusLetterCount = 0;
    //loop through each character of word
      let missingLetters = letters.slice(0);
      for(const char of word){
        if(char == bonusLetter){
          bonusLetterCount++;
        }
        for(const letter of missingLetters){
          if(char == letter){
            missingLetters.splice(missingLetters.indexOf(letter), 1);
          }
        }
      }
      const isPangram = missingLetters.length == 0;
      if(isPangram){
        console.log("This is a panagram");
        console.log(word.length+" "+bonusLetterCount);
        bonusLetterCount = bonusLetterCount > 5? 5 : bonusLetterCount;
        points = pangramData[word.length].points[bonusLetterCount-1];
      }
      else{
        points = noPangramData[word.length].points[bonusLetterCount];
      }
      return points;
  };
  console.log(matchesLetters("phosphoroscopes"));
  console.log(getPoints("phosphoroscopes"));
  const percentage = 150/(json.length);
  let count = 0;
  //loop through words and find longest
  for(const word of json){
    if(count % 7500 == 0){
      await new Promise(res => setTimeout(res, 0));
      worker.postMessage({count, percentage})
    }
    if(word.length >=4 && matchesLetters(word)){
      longestWord.push(word);
    }
    count++;
  }
  progressBar.style.width = '100%';
  longestWord.sort((a, b) => { 
    return getPoints(b) - getPoints(a);
  });
  longestWord = longestWord.slice(0, select.value);
  result.innerHTML = "";
  if (select.value > longestWord.length) {
     result.innerHTML += 'Only '+longestWord.length+' words were found that matched the inputted criteria<br/><br/>';
  }
  
  result.innerHTML += `
  <tr>
    <th>Word</th>
    <th>Points</th>
    <th>Length</th>
  </tr>`;
  
  for(const word of longestWord){
    const row = result.insertRow(-1);
    const cell1 = row.insertCell(0);
    cell1.textContent = word;
    const cell2 = row.insertCell(-1);
    cell2.textContent = getPoints(word)
    const cell3 = row.insertCell(-1);
    cell3.textContent = word.length;
    //result.innerHTML += word+' Points: '+getPoints(word)+' Length: '+word.length+'<br>';
  }
  toggleInputs(true);
  loadingContainer.scrollIntoView(false);
}

//enable/disable input
function toggleInputs(bool){
  toggleMandatory.disabled = !bool;
  input.disabled = !bool;
  submit.disabled = !bool;
  select.disabled = !bool;
  bonusLetterSelect.disabled = !bool;
}

//handle user provided input before providing to algorithm
function handleInput(){
  let userInput = input.value.replaceAll(' ','').replaceAll(',','').toLowerCase();
  userInput = userInput.replace(/[^a-zA-Z ]/g, '').split('');
  if(input.value == ''){
    alert("Input field is blank");
    return;
  }
  const bonusLetter = bonusLetterSelect.value.toLowerCase()
  if(!userInput.includes(bonusLetter)){ 
    alert("Enter a valid bonus letter");
    return; 
  }
  input.value = '';
  let str = '';
  for(const char of userInput){ str += char+' ';}
  document.getElementById('input').innerHTML = "Input: "+str;
  loadingContainer.style.display = 'none';
  result.innerHTML = 'Requesting data...';
  result.scrollIntoView(false);
  toggleInputs(false);
  getLongestWord(userInput, bonusLetter, toggleMandatory.checked);
}