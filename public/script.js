const input = document.querySelector('input[type=text]');
const toggleMandatory = document.getElementById('toggle-mandatory')
const result = document.getElementById('result');
const submit = document.getElementById('submit');
const loadingContainer = document.querySelector('.loading-container');
const progressBar = document.querySelector('.progress-bar');

//webworker
const worker = new Worker('webworker.js');
worker.onmessage = (e) => {
  progressBar.style.width = e.data;
};
//event listeners
input.addEventListener('keydown', e => {
  if(e.key == 'Enter'){
     handleInput();
  }
});
submit.addEventListener('click', e => {
   handleInput();
});

//word finding algorithm
async function getLongestWord(letters, requireMandatoryLetter=false){
  const data = await fetch('/worddata', { method: 'POST' })
  const json = await data.json();
  await new Promise(res => setTimeout(res, 0));
  result.innerHTML = 'Loading...';
  loadingContainer.style.display = 'block';
  progressBar.style.width = '0px';
  loadingContainer.scrollIntoView(false);
  let longestWord = [''];
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
  }
  
  const percentage = 150/json.length;
  let count = 0;
  //loop through words and find longest
  for(const word of json){
    if(count % 7500 == 0){
      await new Promise(res => setTimeout(res, 0));
      worker.postMessage({count, percentage})
    }
    if(matchesLetters(word)){
      if(word.length > longestWord[0].length){
        longestWord = [];
        longestWord.push(word);
      }
      else if(word.length == longestWord[0].length){
        longestWord.push(word);
      }
    }
    count++;
  }
  result.innerHTML = 'Longest Words:<br>';
  for(const word of longestWord){
    result.innerHTML += word+' Length: '+word.length+'<br>';
  }
  toggleInputs(true);
  loadingContainer.scrollIntoView(false);
}

//enable/disable input
function toggleInputs(bool){
  toggleMandatory.disabled = !bool;
  input.disabled = !bool;
  submit.disabled = !bool;
}

//handle user provided input before providing to algorithm
function handleInput(){
  let userInput = input.value.replaceAll(' ','').replaceAll(',','').toLowerCase();
  userInput = userInput.replace(/[^a-zA-Z ]/g, '').split('');
  if(input.value == ''){ return; }
  input.value = '';
  let str = '';
  for(const char of userInput){ str += char+' ';}
  document.getElementById('input').innerHTML = "Input: "+str;
  result.innerHTML = 'Requesting data...';
  result.scrollIntoView(false);
  toggleInputs(false);
  getLongestWord(userInput, toggleMandatory.checked);
}