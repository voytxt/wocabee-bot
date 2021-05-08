// Run this file on Wocabee, for more info, go to README.md file

let hInterval;
let hRunning = false;
let hAutoFocusingInterval;
let hAutoFocusing = true;

if (location.toString().includes('/package_local'))
  document.body.insertAdjacentHTML(
    'afterbegin',
    /* html */
    `<div id="hButtons" style="display: flex; flex-flow: wrap; justify-content: center; margin-bottom: 1.5rem; gap: 0.5rem;">
      <button class="btn btn-danger"    id="hStartButton"     onclick="hStartStop()"   >Auto Translate: OFF</button>
      <button class="btn btn-success"   id="hAutoFocusButton" onclick="hAutoFocus()"   >Auto Focus: ON</button>
      <div style="width: 100%;"></div>
      <button class="btn btn-primary"   id="hTranslateButton" onclick="hTranslate()"   >Translate Current Word</button>
      <button class="btn btn-warning"   id="hLogButton"       onclick="hLog()"         >Log Table</button>
      <button class="btn btn-warning"   id="hLogJSONButton"   onclick="hLogJSON()"     >Log JSON</button>
      <button class="btn btn-secondary" id="hHideButton"      onclick="hHideButtons()" >Hide</button>
    </div>`
  );

// --------------------
//  GET STUFF FROM DOM
// --------------------
const get = (id, canBeNull = false) => {
  return document.getElementById(id) ?? (canBeNull ? null : hError(`Could not find an element with ${id} id!`));
};

const hTranslations = () => [...document.getElementsByClassName('localWord')];
const hTranslationWords = () => hTranslations().map((element) => [element.getAttribute('word'), element.getAttribute('translation')]);
const hWordDisplayed = () => get('tfw_word').innerText;
const hAnswerBox1 = () => get('translateFallingWordAnswer', true);
const hAnswerBox2 = () => get('translateWordAnswer', true);
const hAnswerBox3 = () => get('missingWordAnswer', true);
const hSubmitButton = () => get('translateFallingWordSubmitBtn');

// -----------
//  UTILITIES
// -----------
const hError = (message) => {
  const errorMessage = `THERE WAS AN ERROR WITH THE WOCABEE BOT\n${message}\nStopping the program...`;
  clearInterval(hInterval);
  alert(errorMessage);
  console.error(errorMessage);
};

const hGetTranslation = (word) => {
  let translations = hTranslationWords();
  let translation = null;

  translations.map(([word1, word2]) => {
    if (word === word1) translation = word2;
    else if (word === word2) translation = word1;
  });

  if (translation === null) hError(`Could not find a translation for ${word}!`);
  return translation;
};

// ---------
//  BUTTONS
// ---------
const hStartStop = (delay = 5000) => {
  const hButton = get('hStartButton');
  if (hRunning) {
    clearInterval(hInterval);
    hButton.innerText = 'Auto Translate: OFF';
    hButton.classList = 'btn btn-danger';
  } else {
    hInterval = setInterval(() => {
      hAnswerBox1().value = hGetTranslation(hWordDisplayed());
      hSubmitButton().disabled = false;
      hSubmitButton().click();
    }, delay);
    hButton.innerText = 'Auto Translate: ON';
    hButton.classList = 'btn btn-success';
  }
  hRunning = !hRunning;
};

const hAutoFocus = () => {
  const hButton = get('hAutoFocusButton');
  if (hAutoFocusing) {
    clearInterval(hAutoFocusingInterval);
    hButton.innerText = 'Auto Focus: OFF';
    hButton.classList = 'btn btn-danger';
  } else {
    hAutoFocusingInterval = setInterval(() => {
      try {
        hAnswerBox1().focus();
        hAnswerBox2().focus();
        hAnswerBox3().focus();
      } catch (e) {
        return;
      }
    }, 100);
    hButton.innerText = 'Auto Focus: ON';
    hButton.classList = 'btn btn-success';
  }
  hAutoFocusing = !hAutoFocusing;
};

const hTranslate = () => {
  [
    ['input', 'translateFallingWord', 'tfw_word', 'translateFallingWordAnswer', 'translateFallingWordSubmitBtn'],
    ['input', 'translateWord', 'q_word', 'translateWordAnswer', 'translateWordSubmitBtn'],
    ['choose', 'completeWord', 'completeWordQuestion'],
    ['choose', 'chooseWord', 'ch_word'],
    ['multiChoose', 'findPair', 'q_words', 'a_words'],
    ['transcribe', 'transcribe', 'q_word', 'transcribeAnswerWord', 'transcribeSubmitBtn'], // the word is not stored in the container, but somewhere else... Why? idk
  ].forEach((hId) => {
    const type = hId[0];
    const isContainerVisible = get(hId[1]).style.display !== 'none';

    if (isContainerVisible) {
      const getElements = () => hId.slice(2).map((id) => get(id));

      if (type === 'input') {
        const [word, inputBox, submitButton] = getElements();

        inputBox.value = hGetTranslation(word.innerText);
        submitButton.disabled = false;
      } else if (type === 'choose') {
        const [word] = getElements();

        word.innerText = hGetTranslation(word.innerText);
      } else if (type === 'multiChoose') {
        const [words1, words2] = getElements();

        [...words1.getElementsByClassName('fp_q')].map((word1) => {
          [...words2.getElementsByClassName('fp_a')].map((word2) => {
            if (word1.getAttribute('w_id') === word2.getAttribute('w_id')) {
              word1.classList = 'fp_q btn btn-block btn-lg btn-warning';
              word2.classList = 'fp_a btn btn-block btn-lg btn-warning';
            }
          });
        });
      } else if (type === 'transcribe') {
        const [word, inputBox, submitButton] = getElements();

        inputBox.value = word.innerText;
        submitButton.disabled = false;
      }
    }
  });
};

const hLog = () => console.table(hTranslationWords());

const hLogJSON = () => {
  console.log(
    JSON.stringify(
      hTranslationWords().map((translation) => {
        return { word1: translation[0], word2: translation[1] };
      })
    )
  );
};

const hHideButtons = () => {
  get('hButtons').style.display = 'none';
};
