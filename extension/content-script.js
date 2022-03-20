const translations = [];

if (isThereATask()) {
  log('Starting WocaBot...');
  updateTranslations();
  startSearchingForTasks();
} else {
  info("Can't find any tasks on this page");
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

  visibleTask === undefined ? info("Can't find any task (wait a bit)") : log('Identified task as', visibleTask);

  return visibleTask;
}

function getTranslation(word) {
  return translations.find((translation) => translation[0] === word)[1];
}
