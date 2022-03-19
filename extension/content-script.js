const getId = (id) => document.getElementById(id);
const log = (...message) => console.log('%c[WocaBot] %c' + message.join(' '), 'color: yellow;', 'color: lime;');
const info = (message) => console.info('%c[WocaBot] %c' + message, 'color: yellow;', 'color: aqua;');
const error = (message) => {
  console.error('%c[WocaBot] %c' + message, 'color: yellow;', 'color: red;');
  // alert('WocaBot has encountred an error! Please submit an issue blablabla what went wrong blablala'); <== prob use some bootstrap modal
};

// get all of the translations from html
const translations = [];
[...getId('localWords').children].forEach((child) => {
  const word = child.getAttribute('word');
  const translation = child.getAttribute('translation');

  translations.push([word, translation], [translation, word]);
});

startSearchingForTasks();

// log(translations);

// const taskType = getVisibleTaskType();

function startSearchingForTasks() {
  const interval = setInterval(() => {
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
    case 'chooseWord':
      question = getId('ch_word');
      const possibleAnswers = [...getId('chooseWords').children];
      translation = getTranslation(question.innerText);
      const answer = possibleAnswers.find((answer) => answer.innerText === translation);

      answer.click();
      break;

    case 'findPair':
    case 'choosePicture':
    case 'completeWord':
    case 'transcribe':
      error("This task hasn't been implemented yet");
      return;
  }

  log(`Solved ${taskType}: ${question.innerText} => ${translation}`);
  startSearchingForTasks();
}

function getVisibleTaskType() {
  const taskTypes = ['choosePicture', 'chooseWord', 'completeWord', 'findPair', 'transcribe'];

  const visibleTask = taskTypes.find((taskType) => {
    const taskElement = getId(taskType);

    return taskElement.style.display !== 'none';
  });

  visibleTask === undefined ? info("Can't find any task") : log('Identified task as', visibleTask);

  return visibleTask;
}

function getTranslation(word) {
  return translations.find((translation) => translation[0] === word)[1];
}
