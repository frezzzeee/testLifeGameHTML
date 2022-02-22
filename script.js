const settings = {
  gameSize: [1000, 1000],
  interval: 1000,
  pixelSize: 3
}

const root = document.getElementById('root');
root.addEventListener('click', firstGenerationHandler);
let interval;

let state = {
  figures: []
}

function btnHandlers() {
  const btnStart = document.querySelector('.btn-start');
  btnStart.addEventListener('click', startBtnHandler);
  const btnStop = document.querySelector('.btn-stop');
  btnStop.addEventListener('click', stopBtnHandler);
  function startBtnHandler() {
    root.removeEventListener('click', firstGenerationHandler);
    btnStart.classList.add('hiden');
    btnStop.classList.remove('hiden');
    startGame();
  }
  
  function stopBtnHandler() {
    root.addEventListener('click', firstGenerationHandler);
    btnStart.classList.remove('hiden');
    btnStop.classList.add('hiden');
    stopGame();
  }
}

function firstGenerationHandler(event) {
  if (!event.target.classList.contains('field')) return;
  const t = event.target;
  const p = t.parentNode;
  const pp = t.parentNode.parentNode;
  const x = Array.from(p.children).findIndex(el => el === t);
  const y = Array.from(pp.children).findIndex(el => el === p);
  setGeneration([x, y]);
}

function createFields([x, y]) {
  const fields = [];
  for (let i = 0; i < y; i++) {
    const innerFields = [];
    for (let j = 0; j < x; j++) {
      innerFields.push(`<div class="field" ></div>`);
    }
    fields.push(innerFields);
  }
  
  const coloumns = fields.map(innerFields => {
    return `<div class="coloumn">${innerFields.join('')}</div>`;
  });

  root.innerHTML = `
    <div class="main">${coloumns.join('')}</div>
    <button type="submit" class="btn btn-start">START</button>
    <button type="submit" class="btn btn-stop hiden">STOP</button>
  `
}

function renderState(newState) {
  state.figures.forEach(figure => {
    findField(figure).classList.remove('active');
  });
  state = {...newState};
  state.figures.forEach(figure => {
    findField(figure).classList.add('active');
  });
}

function setGeneration([x, y]) {
  const checked = checkStateFigures(state, [x, y]);
  if (checked) {
    state.figures = state.figures.filter(el => el !== checked);
    findField([x, y]).classList.remove('active');
  } else {
    state.figures.push([x, y]);
    findField([x, y]).classList.add('active');
  }
}

function checkStateFigures(st, [x, y]) {
  return st.figures.find(elements => elements[0] === x && elements[1] === y);
}

function findField([x, y]) {
  return root.children[0].children[y].children[x];
}

function startGame() {
  interval = setInterval(startLife, settings.interval);
}

function stopGame() {
  clearInterval(interval);
}

function getNeighbours([x, y]) {
  const neighbours = [
    [x-1, y-1], [x-1, y], [x-1, y+1],
    [x, y-1], [x, y+1],
    [x+1, y-1], [x+1, y], [x+1, y+1]
  ];
  return neighbours.filter(n => 
    n[0] > -1 && 
    n[1] > -1 && 
    n[0] < settings.gameSize[0] && 
    n[1] < settings.gameSize[1]);
}

function startLife() {
  const newState = {figures: []};
  state.figures.forEach(figure => {
    const activeNeighbours = [];
    const emptyNeighbours = [];
    const neighbours = getNeighbours(figure);
    for (let neighbour of neighbours) {
      if (checkStateFigures(state, neighbour)) {
        activeNeighbours.push(neighbour);
      } else {
        emptyNeighbours.push(neighbour);
      }
    }
    const length = activeNeighbours.length;
    if ((length === 2 || length === 3) && !checkStateFigures(newState, figure)) {
      newState.figures.push(figure);
    }

    for (let neighbour of emptyNeighbours) {
      let innerActiveNeighbours = getNeighbours(neighbour);
      innerActiveNeighbours = innerActiveNeighbours.filter(n => checkStateFigures(state, n));
      if (innerActiveNeighbours.length === 3 && !checkStateFigures(newState, neighbour)) {
        newState.figures.push(neighbour);
      }
    }
  });
  renderState(newState);
}

(function() {
  createFields(settings.gameSize);
  btnHandlers();
})();