// Run this file on Wocabee, for more info, go to README.md file

let hGrindInterval;
let hGrindRunning = false;
let hAutoFocusInterval;
let hAutoFocusRunning = false;

const currentURL = location.toString();
if (currentURL.includes('/package_local') || currentURL.includes('/game')) {
  document.body.insertAdjacentHTML(
    'afterbegin',
    /* html */
    `<div id="hButtons" style="display: flex; flex-flow: wrap; justify-content: center; margin-bottom: 1.5rem; gap: 0.5rem;">
      <button class="btn btn-danger"    id="hGrind"           onclick="hGrind()"       >Auto Grind: OFF</button>
      <button class="btn btn-danger"    id="hAutoFocusButton" onclick="hAutoFocus()"   >Auto Focus: OFF</button>
      <div style="width: 100%;"></div>
      <button class="btn btn-primary"   id="hTranslateButton" onclick="hSolve()"       >Solve the current task</button>
      <button class="btn btn-warning"   id="hLogButton"       onclick="hLog()"         >Log Table</button>
      <button class="btn btn-warning"   id="hLogJSONButton"   onclick="hLog('JSON')"   >Log JSON</button>
      <button class="btn btn-secondary" id="hHideButton"      onclick="hHideButtons()" >Hide</button>
    </div>`
  );
}

// -----------
//  UTILITIES
// -----------
const hGet = (id, canBeNull = false) => {
  const element = document.getElementById(id);

  // normal behavior
  if (element !== null) return element;

  // element is null
  if (canBeNull) return null;
  hError(`Could not find an element with ${id} id!`);
};

const hError = (message) => {
  const errorMessage = `THERE WAS AN ERROR WITH THE WOCABEE BOT\n${message}\nStopping the program...`;

  clearInterval(hGrindInterval);

  alert(errorMessage);
  console.error(errorMessage);
};

const hGetTranslations = () => {
  const translationElements = [...document.getElementsByClassName('localWord')];

  const translations = translationElements.map((element) => {
    const word1 = element.getAttribute('word');
    const word2 = element.getAttribute('translation');
    return [word1, word2];
  });

  return translations;
};

const hGetTranslationFor = (word) => {
  let translations = hGetTranslations();
  let translation = null;

  translations.forEach(([word1, word2]) => {
    if (word === word1) translation = word2;
    else if (word === word2) translation = word1;
  });

  if (translation === null) hError(`Could not find a translation for ${word}!`);

  return translation;
};

// ---------
//  BUTTONS
// ---------
const hGrind = (delay = 5000) => {
  const button = hGet('hGrind');

  const func = () => {
    const wordDisplayed = hGet('tfw_word').innerText;
    const answerBox = hGet('translateFallingWordAnswer');
    const submitButton = hGet('translateFallingWordSubmitBtn');
    const translation = hGetTranslationFor(wordDisplayed);

    answerBox.value = translation;

    submitButton.disabled = false;
    submitButton.click();
  };

  if (hGrindRunning) {
    clearInterval(hGrindInterval);
    button.innerText = 'Auto Grind: OFF';
    button.classList = 'btn btn-danger';
  } else {
    hGrindInterval = setInterval(func, delay);
    button.innerText = 'Auto Grind: ON';
    button.classList = 'btn btn-success';
  }

  hGrindRunning = !hGrindRunning;
};

const hAutoFocus = (delay = 100) => {
  const button = hGet('hAutoFocusButton');

  const func = () => {
    const answerBoxIds = ['translateFallingWordAnswer', 'translateWordAnswer', 'missingWordAnswer'];
    try {
      answerBoxIds.forEach((id) => {
        hGet(id, true).focus();
      });
    } catch (e) {
      return;
    }
  };

  if (hAutoFocusRunning) {
    clearInterval(hAutoFocusInterval);
    button.innerText = 'Auto Focus: OFF';
    button.classList = 'btn btn-danger';
  } else {
    hAutoFocusInterval = setInterval(func, delay);
    button.innerText = 'Auto Focus: ON';
    button.classList = 'btn btn-success';
  }

  hAutoFocusRunning = !hAutoFocusRunning;
};

const hSolve = () => {
  // prettier-ignore
  const tasks = [
    // container id            task type       word id                      input box id                  submit button id
    [ 'translateFallingWord', 'input',        'tfw_word',                   'translateFallingWordAnswer', 'translateFallingWordSubmitBtn' ],
    [ 'translateWord',        'input',        'q_word',                     'translateWordAnswer',        'translateWordSubmitBtn'        ],
    [ 'describePicture',      'input',        'q_word',                     'describePictureAnswer',      'describePictureSubmitBtn'      ],
    [ 'transcribe',           'transcribe',   'q_word',                     'transcribeAnswerWord',       'transcribeSubmitBtn'           ],
    [ 'chooseWord',           'choose',      ['ch_word','chooseWordAnswer']                                                               ],
    [ 'findPair',             'multiChoose', ['q_words','a_words']                                                                        ],
    [ 'completeWord',         'other',        'completeWordQuestion'                                                                      ],
    [ 'choosePicture',        'other',        'choosePictureWord'                                                                         ],
    [ 'addMissingWord',       'other',        'q_sentence'                                                                                ],
  ];

  tasks.forEach((Ids) => {
    const [container, taskType, word, inputBox, submitButton] = Ids;
    const isContainerVisible = hGet(container).style.display !== 'none';

    if (isContainerVisible) {
      switch (taskType) {
        case 'input': {
          const wordElement = hGet(word);
          const translation = hGetTranslationFor(wordElement.innerText);

          hGet(inputBox).value = translation;
          hGet(submitButton).disabled = false;

          break;
        }

        case 'transcribe': {
          const transcription = hGet(word).innerText;

          hGet(inputBox).value = transcription;
          hGet(submitButton).disabled = false;

          break;
        }

        case 'choose': {
          const word1 = hGet(word[0]);
          const words2 = [...document.getElementsByClassName(word[1])];
          const translation = hGetTranslationFor(word1.innerText);

          words2.forEach((word2) => {
            if (word2.innerText === translation) {
              word2.classList = 'chooseWordAnswer btn btn-lg btn-warning btn-block';
            }
          });

          break;
        }

        case 'multiChoose': {
          const words1 = [...hGet(word[0]).getElementsByClassName('fp_q')];
          const words2 = [...hGet(word[1]).getElementsByClassName('fp_a')];

          words1.forEach((word1) => {
            words2.forEach((word2) => {
              if (word1.getAttribute('w_id') === word2.getAttribute('w_id')) {
                word1.classList = 'fp_q btn btn-block btn-lg btn-warning';
                word2.classList = 'fp_a btn btn-block btn-lg btn-warning';
              }
            });
          });

          break;
        }

        case 'other': {
          const wordElement = hGet(word);
          const translation = hGetTranslationFor(wordElement.innerText);

          wordElement.innerText = translation;

          break;
        }
      }
    }
  });
};

const hLog = (format = 'table') => {
  const translations = hGetTranslations();

  switch (format) {
    case 'table':
      console.table(translations);
      break;

    case 'JSON':
      let translationsJSON = translations.map((translation) => {
        return {
          word1: translation[0],
          word2: translation[1],
        };
      });

      translationsJSON = JSON.stringify(translationsJSON);

      console.log(translationsJSON);
      break;
  }
};

const hHideButtons = () => {
  hGet('hButtons').style.display = 'none';
};
