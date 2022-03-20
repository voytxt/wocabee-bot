const getId = (id) => document.getElementById(id);

// log - everything is ok, info - maybe something wrong?, error - something has gone wrong
const log = (...message) => console.log('%c[WocaBot] %c' + message.join(' '), 'color: yellow;', 'color: lime;');
const info = (message) => console.info('%c[WocaBot] %c' + message, 'color: yellow;', 'color: aqua;');
const error = (message) => {
  console.error('%c[WocaBot] %c' + message, 'color: yellow;', 'color: red;');
  // alert('WocaBot has encountred an error! Please submit an issue blablabla what went wrong blablala'); <== prob use some bootstrap modal
};
