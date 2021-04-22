// Run this file on Wocabee, for more info, go to README.md file

let haxInterval;

if (location.toString().includes('/app')) document.body.insertAdjacentHTML('afterbegin', '<div id="haxButtons" style="display: flex; justify-content: center; gap: 1rem;"><button class="btn btn-primary" onclick=startHax()>Start</button><button class="btn btn-primary" onclick=logHax()>Log</button><button class="btn btn-primary" onclick=document.getElementById(\'haxButtons\').style.display=\'none\'>Hide</button></div><hr>');

const startHax = (delay = 5000) => haxInterval = setInterval(hax, delay);
const stopHax = () => clearInterval(haxInterval);

const hax = () => {
  const translationElements = [...document.getElementsByClassName('localWord')];
  const wordDisplayed = document.getElementById('tfw_word').innerText;
  const answerInputBox = document.getElementById('translateFallingWordAnswer');
  const submitButton = document.getElementById('translateFallingWordSubmitBtn');

  translationElements.forEach((element) => {
    const word1 = element.getAttribute('word');
    const word2 = element.getAttribute('translation');

    if (wordDisplayed === word1) answerInputBox.value = word2;
    else if (wordDisplayed === word2) answerInputBox.value = word1;
    else return;

    submitButton.disabled = false;
    submitButton.click();
  });
}

const logHax = () => {
  const translationElements = [...document.getElementsByClassName('localWord')];
  const array = translationElements.map(element => {
    const word1 = element.getAttribute('word');
    const word2 = element.getAttribute('translation');
    return [word1, word2];
  });
  console.table(array);
};

// focus the answer box every 0.1s
setInterval(() => {
  try { document.getElementById('translateFallingWordAnswer').focus(); }
  catch (e) { return; }
}, 100);
