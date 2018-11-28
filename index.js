const app = new PIXI.Application({
    height: 780,
    width: 780,
})
document.body.appendChild(app.view);

const g = new PIXI.Graphics();
app.stage.addChild(g);

const gameScene = new PIXI.Container();
app.stage.addChild(gameScene);

let step = 0

const snake = {
    length: 8,
    path: [
        [0, 0],
        [0, 1],
        [0, 2],
    ],
    x: 0,
    y: 0,
    xs: 1,
    ys: 0,
}

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
}

function gameLoop(delta) {
    snake.x += snake.xs
    snake.y += snake.ys
    g.clear()
    g.beginFill(0xFF3300)
    snake.path.forEach((cord, i) => {
        g.drawRect(cord[0] * 15, cord[1] * 15, 15, 15)
    })

    if (step > 3) {
        snake.length <= snake.path.length && snake.path.shift()
        const last = snake.path[snake.path.length - 1]
        snake.path.push([last[0] + snake.xs, last[1] + snake.ys])
        step = 0
    } else step++
}

function play(delta) {
    
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