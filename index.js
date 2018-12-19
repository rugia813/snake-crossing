const grid = 5
const goalHeight = 10 * grid
const waterHeight = 60  * grid
const midSafeAreaHeight = 5 * grid
const roadHeight = 60 * grid
const bottomSafeAreaHeight = 5 * grid

const waterOffset = goalHeight
const midSafeAreaOffset = waterOffset + waterHeight
const roadOffset = midSafeAreaOffset + midSafeAreaHeight
const bottomSafeAreaOffset = roadOffset + roadHeight

const width = 780
const height = 780
const app = new PIXI.Application({
    height,
    width,
})
document.body.appendChild(app.view);

const g = new PIXI.Graphics();
app.stage.addChild(g);

const gameScene = new PIXI.Container();
app.stage.addChild(gameScene);

let step = 0
let state = play

const snakeY = 150
const snake = {
    length: 8,
    path: [
        [0, snakeY],
        [0, snakeY + 1],
        [0, snakeY + 2],
    ],
    x: 0,
    y: snakeY,
    xs: 1,
    ys: 0,
}

const car = {
    xs: 1,
    x: 0,
    y: 0
}
let cars = new Array(6).fill()
cars = cars.map((e) => Object.assign({}, car))

const drifter = {
    xs: 1,
    x: 0,
    y: 0
}
let drifters = new Array(6).fill()
drifters = drifters.map((e) => Object.assign({}, drifter))

setup()
app.ticker.add(delta => gameLoop(delta))
app.ticker.deltaTime = 2

function setup() {
    let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown"),
      direction = 1

    up.press = () => {
        if (direction === 2) return
        direction = 0

        snake.xs = 0;
        snake.ys = -1;
    };
    right.press = () => {
        if (direction === 3) return
        direction = 1

        snake.xs = 1;
        snake.ys = 0;
    };
    down.press = () => {
        if (direction === 0) return
        direction = 2

        snake.xs = 0;
        snake.ys = 1;
    };
    left.press = () => {
        if (direction === 1) return
        direction = 3

        snake.xs = -1;
        snake.ys = 0;
    };

    //cars
    cars.forEach((car, i) => {
        const carHeight = 2 * grid
        const padding = (roadHeight - cars.length * carHeight) / cars.length
        car.x = Math.random() * 740
        car.y = roadOffset + (i * carHeight) + padding * i + 2 * grid
        car.xs = Math.random() * 10 + 9
    })

    //drifters
    drifters.forEach((drifter, i) => {
        const drifterHeight = waterHeight / drifters.length
        const padding = (roadHeight - drifters.length * drifterHeight) / drifters.length
        drifter.x = Math.random() * 740
        drifter.y = waterOffset + (i * drifterHeight)
        drifter.xs = Math.random() * 10 + 4
    })
}

function gameLoop(delta) {
    state(delta)
}

function play(delta) {
    g.clear()
    //bg
    //goal
    g.beginFill(78601)
    g.drawRect(0, 0, width, goalHeight)
    //water
    g.beginFill(38600)
    g.drawRect(0, waterOffset, width, waterHeight)
    //m safe
    g.beginFill(100234557)
    g.drawRect(0, midSafeAreaOffset, width, midSafeAreaHeight)
    //road
    g.beginFill(10000000)
    g.drawRect(0, roadOffset, width, roadHeight)
    //bot safe
    g.beginFill(100234557)
    g.drawRect(0, bottomSafeAreaOffset, width, height - bottomSafeAreaOffset)

    //snake
    snake.x += snake.xs
    snake.y += snake.ys
    g.beginFill(0xFF3300)
    snake.path.forEach((cord, i) => {
        g.drawRect(cord[0] * grid, cord[1] * grid, grid, grid)
    })

    if (step > 3) {
        snake.length <= snake.path.length && snake.path.shift()
        const last = snake.path[snake.path.length - 1]
        snake.path.push([last[0] + snake.xs, last[1] + snake.ys])
        step = 0
    } else step++

    //cars
    cars.forEach((car, i) => {
        g.beginFill(0xFF3300)
        g.drawRect(car.x, car.y, 6 * grid, 2 * grid)
        //wheels
        g.beginFill(667847)
        g.drawRect(car.x, car.y - grid, grid, grid)
        g.drawRect(car.x + 5 * grid, car.y - grid, grid, grid)
        g.drawRect(car.x, car.y + 2 * grid, grid, grid)
        g.drawRect(car.x + 5 * grid, car.y + 2 * grid, grid, grid)
    })

    //drifters
    drifters.forEach((drifter, i) => {
        g.beginFill(127881234)
        g.drawRect(drifter.x, drifter.y, 16 * grid, waterHeight / drifters.length)
    })
    
    if (step > 3) {
        //cars
        cars.forEach((car, i) => {
            if (car.x >= 780)
                car.x = 0
            else
                car.x += car.xs
        })

        //drifters
        drifters.forEach((drifter, i) => {
            if (drifter.x >= 780)
                drifter.x = 0
            else
                drifter.x += drifter.xs
        })
        step = 0
    } else step++
}

function end() {
//All the code that should run at the end of the game
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }