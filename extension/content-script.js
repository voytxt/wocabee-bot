let isRunning = false;
const translations = [];

injectHTML();

function main() {
  if (isThereATask()) {
    log('Starting WocaBot...');
    updateTranslations();
    startSearchingForTasks();
  } else {
    info("Can't find any tasks on this page");
  }
}

function injectHTML() {
  const form = getId('mainForm');

  if (form === null) {
    info("Couldn't find a place on this page to put the button, this probably means that you aren't doing a task yet");
    return;
  }

  const customHTML = /* html */ `<div class="form-group">
    <button id="wocaBot" class="btn btn-danger btn-lg">WocaBot: OFF</button>
  </div>`;

  form.insertAdjacentHTML('afterbegin', customHTML);

  getId('wocaBot').addEventListener('click', (event) => {
    if (isRunning) {
      isRunning = false;
      event.target.innerText = 'WocaBot: OFF';
      event.target.classList.replace('btn-success', 'btn-danger');
    } else {
      isRunning = true;
      event.target.innerText = 'WocaBot: ON';
      event.target.classList.replace('btn-danger', 'btn-success');
      main();
    }
  });
}

function isThereATask() {
  return getId('mainForm') !== null;
}

function updateTranslations() {
  const localWords = getId('localWords');

  [...localWords.children].forEach((child) => {
    const word = child.getAttribute('word');
    const translation = child.getAttribute('translation');

    translations.push([word, translation], [translation, word]);
  });
}

function startSearchingForTasks() {
  const interval = setInterval(() => {
    if (!isRunning) {
      clearInterval(interval);
      return;
    }

    const taskType = getVisibleTaskType();

    if (taskType !== undefined) {
      clearInterval(interval);
      solveTask(taskType);
    }
  }, 100);
}

function solveTask(taskType) {
  let question, translation;

  switch (taskType) {
    // TODO: this one still doesn't work
    case 'addMissingWord': {
      question = getId('q_sentence');
      translation = getTranslation(question.innerText);

      const descriptiveNameForAVariable = getId('a_sentence');
      const answer = getId('missingWordAnswer');
      const sumbit = getId('addMissingWordSubmitBtn');

      const wordToType = [...translation].filter((letter, index) => {
        return letter !== descriptiveNameForAVariable.innerText[index];
      });

      answer.value = wordToType.join('');
      answer.focus();
      sumbit.click();
      isRunning = false;
      // sumbit.style.display = '';
      // submit.click();
      break;
    }

    case 'arrangeWords': {
      question = getId('def-lang-sentence');
      translation = getTranslation(question.innerText);

      const description = getId('arrangeWords').querySelector('.methodDesc');

      description.innerText = "WocaBot doesn't know how to solve this task :(\n\nThe correct answer is\n" + translation;
      break;
    }

    case 'choosePicture': {
      question = getId('choosePictureWord');
      translation = getTranslation(question.innerText);

      const answer = getId('word-img-container').querySelector(`[word=${translation}]`);

      answer.click();
      answer.click();
      break;
    }

    case 'chooseWord': {
      question = getId('ch_word');
      translation = getTranslation(question.innerText);

      const possibleAnswers = [...getId('chooseWords').children];
      const answer = possibleAnswers.find((answer) => answer.innerText === translation);

      answer.click();
      break;
    }

    case 'completeWord': {
      question = getId('completeWordQuestion');
      translation = getTranslation(question.innerText);

      const answer = getId('completeWordAnswer');
      const characters = [...getId('characters').children];
      const submit = getId('completeWordSubmitBtn');

      const charactersToClickOn = [...translation].filter((letter, index) => {
        return letter !== answer.innerText[index];
      });

      charactersToClickOn.forEach((characterToClickOn) => {
        const character = characters.find((character) => {
          return character.innerText === characterToClickOn;
        });

        console.log(character);
        character.click();
      });

      submit.click();
      break;
    }

    case 'describePicture': {
      question = getId('q_word');
      translation = getTranslation(question.innerText);

      const submit = getId('describePictureSubmitBtn');

      getId('describePictureAnswer').value = translation;
      submit.disabled = false;
      submit.click();
      break;
    }

    case 'findPair': {
      const possibleQuestions = [...getId('q_words').children];
      const possibleAnswers = [...getId('a_words').children];

      possibleQuestions.forEach((possibleQuestion) => {
        const answer = possibleAnswers.find((possibleAnswer) => {
          const translation = getTranslation(possibleQuestion.innerText);
          return translation === possibleAnswer.innerText;
        });

        if (answer !== undefined) {
          question = possibleQuestion;
          translation = answer.innerText;

          question.click();
          answer.click();
        }
      });

      break;
    }

    case 'transcribe': {
      question = getId('q_word');
      translation = question.innerText;

      const submit = getId('transcribeSubmitBtn');

      getId('transcribeAnswerWord').value = translation;
      submit.disabled = false;
      submit.click();
      break;
    }

    case 'translateFallingWord': {
      question = getId('tfw_word');
      translation = getTranslation(question.innerText);

      const submit = getId('translateFallingWordSubmitBtn');

      getId('translateFallingWordAnswer').value = translation;
      submit.disabled = false;
      submit.click();
      break;
    }

    case 'translateWord': {
      question = getId('q_word');
      translation = getTranslation(question.innerText);

      const submit = getId('translateWordSubmitBtn');

      getId('translateWordAnswer').value = translation;
      submit.disabled = false;
      submit.click();
      break;
    }

    default:
      error("This task hasn't been implemented yet");
      return;
  }

  log(`Solved ${taskType}: ${question.innerText} => ${translation}`);
  startSearchingForTasks();
}

function getVisibleTaskType() {
  const taskTypes = [
    'addMissingWord',
    'arrangeWords',
    'choosePicture',
    'chooseWord',
    'completeWord',
    'describePicture',
    'findPair',
    'transcribe',
    'translateFallingWord',
    'translateWord',
  ];

  const visibleTask = taskTypes.find((taskType) => {
    const taskElement = getId(taskType);

    return taskElement.style.display !== 'none';
  });

  visibleTask === undefined ? info("Can't find any task (wait a bit)") : log('Identified task as', visibleTask);

  return visibleTask;
}

function getTranslation(word) {
  return translations.find((translation) => translation[0] === word)[1];
}
