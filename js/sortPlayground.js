/**
 * Playground for test bubble sort algorithm using
 * visual bars.
 *
 * @author Leonardo E. Oliveira
 */

const MAIN_CONTENT = "main-sort";
const BAR_WIDTH = 50;

const STATUS = {
  running: 1,
  stopped: 0,
};

const state = {
  randomize: {
    status: STATUS.stopped,
  },
  sort: {
    status: STATUS.stopped,
  },
  projects: {
    status: STATUS.stopped,
  },
  resized: false,
};

const keymapEvents = {
  R: {
    event: randomize,
    run: () => state.randomize.status === STATUS.stopped,
  },
  S: {
    event: applyBubbleSort,
    run: () => state.sort.status === STATUS.stopped,
  },
  P: {
    event: showProjects,
    run: () => true,
  },
};

document.addEventListener("keyup", (event) => {
  const { key } = event;

  const keymapEvent = keymapEvents[key.toUpperCase()];

  if (keymapEvent && keymapEvent.run()) {
    keymapEvent.event();
  }
});

window.addEventListener("resize", () => {
  if (state.randomize.status === STATUS.stopped) {
    randomize();
  }
});

function showProjects() {
  const content = document.getElementById("projects");

  animateCircle({
    color: "blue",
    zIndex: 4,
  });

  setTimeout(() => {
    content.classList.add("background-color-blue");
    content.classList.remove("hidden");
  }, 400);

  console.log("Please, show me the projects");
}

function getWindowWidth() {
  return document.body.offsetWidth;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function applyBubbleSort() {
  animateCircle({
    color: "yellow",
  });
  updateStatusSort(STATUS.running);

  const bars = Array(...document.querySelector(".bars").children).map((bar) => {
    return {
      height: parseInt(bar.dataset.height),
      translateX: 0,
      element: bar,
    };
  });

  let switched;

  do {
    switched = false;
    for (let i = 0; i < bars.length - 1; i++) {
      const current = bars[i];
      const next = bars[i + 1];

      if (current.height > next.height) {
        current.translateX += BAR_WIDTH;
        next.translateX -= BAR_WIDTH;
        current.element.style.transform = `translateX(${current.translateX}px)`;
        next.element.style.transform = `translateX(${next.translateX}px)`;
        bars[i] = next;
        bars[i + 1] = current;
        switched = true;
        await sleep(100);
      }
    }
  } while (switched);

  updateStatusSort(STATUS.stopped);
}

function removeBar(bar) {
  bar.remove();
}

function animateRemoveBar(bar) {
  bar.classList.add("removed-bar");
}

function timeoutRemoveBar({ timeout, bar }) {
  animateRemoveBar(bar);

  setTimeout(() => {
    removeBar(bar);
  }, timeout);
}

function updateStatusRandomize(status) {
  state.randomize.status = status;
}

function updateStatusSort(status) {
  state.sort.status = status;
}

function randomize() {
  animateCircle({
    color: "red",
  });

  updateStatusRandomize(STATUS.running);

  const barsElement = document.querySelector(".main-sort .bars");

  const totalBarsEvaluated = Math.floor(getWindowWidth() / BAR_WIDTH);

  Array(...barsElement.children).forEach((bar) =>
    timeoutRemoveBar({
      bar,
      timeout: 400,
    })
  );

  setTimeout(() => {
    for (let i = 0; i < totalBarsEvaluated; i++) {
      barsElement.appendChild(randomVerticalBar());
    }

    updateStatusSort(STATUS.stopped);
    updateStatusRandomize(STATUS.stopped);
  }, 550);
}

function createSortArea() {
  const mainSortArea = document.createElement("div");
  mainSortArea.className = MAIN_CONTENT;

  const barsElement = document.createElement("div");
  barsElement.className = "bars";

  mainSortArea.appendChild(barsElement);
  document.body.appendChild(mainSortArea);

  randomize();
}

function createVerticalBar({ height, color }) {
  const bar = document.createElement("div");

  bar.dataset.height = height;
  bar.className = "vertical-bar";
  bar.style.height = `${height}vh`;
  bar.style.backgroundColor = color;

  return bar;
}

function randomVerticalBar() {
  const color = randomCssColor();
  const height = randomInteger({
    min: 10,
    max: 38,
  });

  return createVerticalBar({
    color,
    height,
  });
}

function randomInteger({ min, max }) {
  return Math.floor(Math.random() * max) + min;
}

function animateCircle({ color, zIndex }) {
  const circle = document.createElement("div");
  circle.className = `background-circle background-color-${color}`;

  if (zIndex) {
    circle.style.zIndex = zIndex;
  }

  document.querySelector(".circle-events").appendChild(circle);
}

function randomCssColor() {
  const min = 0;
  const max = 255;

  const red = randomInteger({
    max,
    min,
  });
  const green = randomInteger({
    max,
    min,
  });
  const blue = randomInteger({
    max,
    min,
  });

  return `rgb(${red}, ${green}, ${blue})`;
}

createSortArea();
