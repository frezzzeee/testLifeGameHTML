const settings = {
  gameSize: [100, 100],
  interval: 1000,
  pixelSize: 10
}

const root = document.getElementById('root');
root.addEventListener('click', firstGenerationHandler);
root.innerHTML = `
  <div class="canvas">
    <canvas id="canvas"></canvas>
  </div>
  <button type="submit" class="btn btn-start">START</button>
  <button type="submit" class="btn btn-stop hiden">STOP</button>
`
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = settings.gameSize[0] * settings.pixelSize;
canvas.height = settings.gameSize[1] * settings.pixelSize;
ctx.fillStyle = 'green';

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
  if (!event.target.id === 'canvas') return;
  const x = event.layerX - (event.layerX % settings.pixelSize)
  const y = event.layerY - (event.layerY % settings.pixelSize)
  const checked = isAlreadyInState(state, [x, y]);
  if (checked) {
    state.figures = state.figures.filter(el => el !== checked);
    ctx.clearRect(x, y, settings.pixelSize, settings.pixelSize)
  } else {
    state.figures.push([x, y]);
    ctx.fillRect(x, y, settings.pixelSize, settings.pixelSize);
  }
}

function renderState(newState) {
  state.figures.forEach(figure => {
    const [x,y] = figure;
    ctx.clearRect(x, y, settings.pixelSize, settings.pixelSize)
  });
  state = {...newState};
  state.figures.forEach(figure => {
    const [x,y] = figure;
    ctx.fillRect(x, y, settings.pixelSize, settings.pixelSize);
  });
}

function isAlreadyInState(st, [x, y]) {
  return st.figures.find(elements => elements[0] === x && elements[1] === y);
}

function startGame() {
  interval = setInterval(startLife, settings.interval);
}

function stopGame() {
  clearInterval(interval);
}

function getNeighbours([x, y]) {
  const i = settings.pixelSize;
  const neighbours = [
    [x-i, y-i], [x-i, y], [x-i, y+i],
    [x, y-i], [x, y+i],
    [x+i, y-i], [x+i, y], [x+i, y+i]
  ];
  return neighbours.filter(n => 
    n[0] > -i && 
    n[1] > -i && 
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
      if (isAlreadyInState(state, neighbour)) {
        activeNeighbours.push(neighbour);
      } else {
        emptyNeighbours.push(neighbour);
      }
    }
    const length = activeNeighbours.length;
    if ((length === 2 || length === 3) && !isAlreadyInState(newState, figure)) {
      newState.figures.push(figure);
    }

    for (let neighbour of emptyNeighbours) {
      let innerActiveNeighbours = getNeighbours(neighbour);
      innerActiveNeighbours = innerActiveNeighbours.filter(n => isAlreadyInState(state, n));
      if (innerActiveNeighbours.length === 3 && !isAlreadyInState(newState, neighbour)) {
        newState.figures.push(neighbour);
      }
    }
  });
  renderState(newState);
}

(function() {
  btnHandlers();
})();