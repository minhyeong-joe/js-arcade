var gamearea = document.getElementById("gamearea");
var width = gamearea.width;
var height = gamearea.height;
var ctx = gamearea.getContext("2d");
var snake = [{x:-1,y:0}];
var headX = snake[0].x, headY = snake[0].y;
var tail;
var frogX, frogY;
var poison = [];
var cell = 30;
var dir = 'right', newdir = 'right';
var vx = cell, vy = 0;
var frame = 150;
var score = 0;
var gamerun;
var speedInc;
var keyDisabled = true;
var gameStart = false;
var gameOver = false;
var keyMap=[];
var timecount;
var time = 0;
var min, sec;
var lives = 3;
var poisonNum = 4;
var soundon = true;
var paused = false;
var lastPosition = [];

var snakeImage = new Image();
snakeImage.src = 'assets/img/snake-sprite-yellow.png';
var frogImage = new Image();
frogImage.src = 'assets/img/frog.png';
var poisonImage = new Image();
poisonImage.src = 'assets/img/poison.png';

var BGM = document.getElementById("bgm");
BGM.volume = 0.3;


var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);



//initial screen
ctx.fillStyle = "#0c5831";
ctx.fillRect(0,0, width, height);
ctx.font = "30px Arial";
ctx.fillStyle = "black";
ctx.fillText("Press spacebar or tap to begin", 20, 240);

//keybinding
$(window).on("keydown", function(e)
{
  if (e.keyCode == 32 && !gameStart)
  {
    if(gameOver)
    {
      reset();
      gameOver = false;
    }
    startGame();
    gameStart = true;
  } else if (e.keyCode == 32 && gameStart) {
    pauseGame();
  }
  keyMap[e.keyCode] = true;
});

function pauseGame() {
  if(paused) {
    timecount = setInterval(function(){
      time++;
      min = Math.floor(time/60);
      sec = time%60;
      if (min < 10){ min = "0" + min;}
      if (sec < 10){ sec = "0" + sec;}
    }, 1000);
    speedInc = setInterval(speedUp, 1500);
    keyDisabled=false;
  } else {
    clearInterval(timecount);
    clearInterval(speedInc);
    keyDisabled=true;
  }

  paused = !paused;

  ctx.fillStyle = "rgba(100,100,100,0.5)";
  ctx.fillRect(0,0, width, height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Game Paused", 135, 240);
  update();
};

$(window).on("keyup", function(e)
{
  keyMap[e.keyCode] = false;
});

$("#gamearea").on("click", function(){
  if (!gameStart)
  {
    if(gameOver)
    {
      reset();
      gameOver = false;
    }
    startGame();
    gameStart = true;
    document.getElementById("eat").volume = 0;
    document.getElementById("eat").play();
    document.getElementById("eat").pause();
    document.getElementById("eat").volume = 1;
    document.getElementById("dead").volume = 0;
    document.getElementById("dead").play();
    document.getElementById("dead").pause();
    document.getElementById("dead").volume = 1;
    document.getElementById("poison").volume = 0;
    document.getElementById("poison").play();
    document.getElementById("poison").pause();
    document.getElementById("poison").volume = 1;
    document.getElementById("collide").volume = 0;
    document.getElementById("collide").play();
    document.getElementById("collide").pause();
    document.getElementById("collide").volume = 1;
  } else {
    pauseGame();
  }
});

$('.right').on('touchstart', function() {
  keyMap[39] = true;
});
$('.left').on('touchstart', function() {
  keyMap[37] = true;
});
$('.up').on('touchstart', function() {
  keyMap[38] = true;
});
$('.down').on('touchstart', function() {
  keyMap[40] = true;
});

$('.right').on('touchend', function() {
  keyMap[39] = false;
});
$('.left').on('touchend', function() {
  keyMap[37] = false;
});
$('.up').on('touchend', function() {
  keyMap[38] = false;
});
$('.down').on('touchend', function() {
  keyMap[40] = false;
});


//Spacebar(keyCode 32) will trigger startGame function
//Create snake, frog(food), and initialize the animation every //frame
function startGame()
{
  document.getElementById("dead").pause();
  if (soundon) {
    BGM.play();
  }
  createSnake();
  createPoison();
  createFrog();
  timer();
  setInterval(function(){
    if (keyMap[39] && dir != 'left' && !keyDisabled)
    {
      newdir = 'right';
      vx = cell;
      vy = 0;
    }
    if (keyMap[37] && dir != 'right' && !keyDisabled)
    {
      newdir = 'left';
      vx = -cell;
      vy = 0;
    }
    if (keyMap[38] && dir != 'down' && !keyDisabled)
    {
      newdir = 'up';
      vx = 0;
      vy = -cell;
    }
    if (keyMap[40] && dir != 'up' && !keyDisabled)
    {
      newdir = 'down';
      vx = 0;
      vy = cell;
    }
  } , 0.01);
  speedInc = setInterval(speedUp, 1500);
  gamerun = setTimeout(update, frame);
  setTimeout(function()
  {
    keyDisabled = false;
  }, 2*frame);
}

//y=0 from left-top corner
function createSnake()
{
  for (var i = -1; i < 1; i++)
  {
    snake.push({x: i, y: 0});
  }
}

//random location of food
function createFrog()
{
  var ranNum = Math.floor(Math.random()*(width/cell));
  frogX = ranNum;
  ranNum = Math.floor(Math.random()*(height/cell));
  frogY = ranNum;
  for (var i = 0; i < snake.length; i++)
  {
    for (var j = 0; j < poisonNum; j++)
    {
    if ((frogX == snake[i].x && frogY == snake[i].y) || (frogX == poison[j].x && frogY == poison[j].y))
      createFrog();
    }
  }
}



function createPoison()
{
  for (var k = 0; k < poisonNum; k++)
  {
    var ranNum = Math.floor(Math.random()*(width/cell));
    var ranNum2 = Math.floor(Math.random()*(height/cell));
    poison[k] = {x: ranNum, y:ranNum2};
  }
  for (var i = 0; i < snake.length; i++)
  {
    for (var j = 0; j < poisonNum; j++)
    {
    if (poison[j].x == snake[i].x && poison[j].y == snake[i].y)
      createPoison();
    }
  }
}

//speed& difficulty increase
function speedUp()
{
  if (frame >= 110)
    frame-=2.5;
  else if (frame >= 75 && frame < 110)
    frame-=1;
  else if (frame < 75 && frame > 60)
    frame-=0.1;
  else if (frame <= 60)
    clearInterval(speedInc);
}

//repeat snake move and canvas update throughout gameplay
//snake moving, eating, and growing (tail-to-head mechanism)
function update()
{
  if (!paused && !gameOver)
  {
    clearCanvas();
    direction(newdir);
    dir = newdir;
    if (!keyDisabled)
      checkGameover();
    if (headX == frogX && headY == frogY)
    {
      document.getElementById("eat").currentTime = 0.3;
      document.getElementById("eat").play();
      tail = {x: headX, y: headY};
      score++;
      if (score%4 === 0)
      {
        poisonIncrease();
      }
      createPoison();
      createFrog();
    }
    else if (!gameOver)
    {
      tail = snake.pop();
      tail.x = headX;
      tail.y = headY;
    }
    for (var i = 0; i < poisonNum; i++)
    {
      if (headX == poison[i].x && headY == poison[i].y)
      {
        if (lives <= 1) {
          document.getElementById("dead").currentTime = 0;
          document.getElementById("dead").play();
        } else {
          document.getElementById("poison").currentTime = 0;
          document.getElementById("poison").play();
        }
        lives--;
        tail.x = headX;
        tail.y = headY;
        createFrog();
        createPoison();
      }
    }
    snake.unshift(tail);
    for (var j = 0; j < snake.length; j++)
    {
      paint(snake[j].x,snake[j].y, 'snake');
    }
    for (var k = 0; k < poisonNum; k++)
    {
      paint(poison[k].x, poison[k].y, 'poison');
    }
    paint(frogX, frogY, 'frog');
    displayTime();
    displayScore();
    displayLives();
    gamerun = setTimeout(update, frame);
  }
}

function poisonIncrease()
{
  if (poisonNum < 12)
    poisonNum++;
}

//check direction
function direction(d)
{
  if(d == 'right')
    headX++;
  if(d == 'left')
    headX--;
  if (d == 'up')
    headY--;
  if (d == 'down')
    headY++;
}

//display Scoreboard
function displayScore()
{
  ctx.font = "12px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score : " +score, 10, 440);
}

//draw snake and frog
function paint(x,y, who)
{
  if (who == 'snake')
  {
    for (var i=0; i<snake.length; i++) {
      var spriteX = 0;
      var spriteY = 0;
      if (i===0) {
        if (newdir == 'up') {
          spriteX = 3;
          spriteY = 0;
        } else if (newdir == 'down') {
          spriteX = 4;
          spriteY = 1;
        } else if (newdir == 'left') {
          spriteX = 3;
          spriteY = 1;
        } else {
          spriteX = 4;
          spriteY = 0;
        }
      } else if (i===snake.length-1) {
        if (snake[i].y > snake[i-1].y) {
          //snake tail is following upwards
          spriteX = 3;
          spriteY = 2;
        } else if (snake[i].y < snake[i-1].y) {
          // snake tail is following downwards
          spriteX = 4;
          spriteY = 3;
        } else if (snake[i].x > snake[i-1].x ) {
          //snake tail going left
          spriteX = 3;
          spriteY = 3;
        } else {
          //snake tail going right
          spriteX = 4;
          spriteY = 2;
        }
      } else {
        if (snake[i].x < snake[i-1].x) {
          // snake heading right
          if (snake[i].y < snake[i+1].y) {
            spriteX = 0;
            spriteY=0;
          } else if (snake[i].y > snake[i+1].y) {
            spriteX = 0;
            spriteY = 1;
          } else {
            spriteX = 1;
            spriteY=0;
          }
        } else if (snake[i].x > snake[i-1].x) {
          //snake heading left
          if (snake[i].y < snake[i+1].y) {
            spriteX=2;
            spriteY=0;
          } else if (snake[i].y > snake[i+1].y) {
            spriteX=2;
            spriteY=2;
          } else {
            spriteX=1;
            spriteY=0;
          }
        } else if (snake[i].y > snake[i-1].y){
          //snake moving up
          if (snake[i].x > snake[i+1].x) {
            spriteX=2;
            spriteY=2;
          } else if (snake[i].x < snake[i+1].x){
            spriteX= 0;
            spriteY=1;
          } else {
            spriteX=2;
            spriteY=1;
          }
        } else {
          // snake moving down
          if (snake[i].x > snake[i+1].x) {
            spriteX=2;
            spriteY=0;
          } else if (snake[i].x < snake[i+1].x) {
            spriteX=0;
            spriteY=0;
          } else {
            spriteX =2;
            spriteY=1;
          }
        }
      }
      ctx.drawImage(snakeImage, spriteX*64, spriteY*64, 64, 64, snake[i].x*cell, snake[i].y*cell, cell, cell);
    }
  }
  else if (who == 'frog')
  {
    ctx.drawImage(frogImage, x*cell, y*cell, cell, cell);
  }
  else if (who == 'poison')
  {
    ctx.drawImage(poisonImage, x*cell, y*cell, cell, cell);
  } else {
    for (var i=0; i<lastPosition.length; i++) {
      var spriteX = 0;
      var spriteY = 0;
      if (i===0) {
        if (lastPosition[0].x == lastPosition[1].x) {
          if (lastPosition[0].y < lastPosition[1].y) {
            spriteX = 3;
            spriteY = 0;
            newdir = 'up'
          } else {
            spriteX = 4;
            spriteY = 1;
            newdir ='down'
          }
        } else if (lastPosition[0].y == lastPosition[1].y) {
          if (lastPosition[0].x < lastPosition[1].x) {
            spriteX = 3;
            spriteY = 1;
            newdir='left'
          } else {
            spriteX = 4;
            spriteY = 0;
            newdir='right'
          }
        } else {
          if (newdir == 'up') {
            spriteX = 3;
            spriteY = 0;
          } else if (newdir == 'down') {
            spriteX = 4;
            spriteY = 1;
          } else if (newdir == 'left') {
            spriteX = 3;
            spriteY = 1;
          } else {
            spriteX = 4;
            spriteY = 0;
          }
        }
      } else if (i===lastPosition.length-1) {
        if (lastPosition[i].y > lastPosition[i-1].y) {
          //lastPosition tail is following upwards
          spriteX = 3;
          spriteY = 2;
        } else if (lastPosition[i].y < lastPosition[i-1].y) {
          // lastPosition tail is following downwards
          spriteX = 4;
          spriteY = 3;
        } else if (lastPosition[i].x > lastPosition[i-1].x ) {
          //lastPosition tail going left
          spriteX = 3;
          spriteY = 3;
        } else {
          //lastPosition tail going right
          spriteX = 4;
          spriteY = 2;
        }
      } else {
        if (lastPosition[i].x < lastPosition[i-1].x) {
          // lastPosition heading right
          if (lastPosition[i].y < lastPosition[i+1].y) {
            spriteX = 0;
            spriteY=0;
          } else if (lastPosition[i].y > lastPosition[i+1].y) {
            spriteX = 0;
            spriteY = 1;
          } else {
            spriteX = 1;
            spriteY=0;
          }
        } else if (lastPosition[i].x > lastPosition[i-1].x) {
          //lastPosition heading left
          if (lastPosition[i].y < lastPosition[i+1].y) {
            spriteX=2;
            spriteY=0;
          } else if (lastPosition[i].y > lastPosition[i+1].y) {
            spriteX=2;
            spriteY=2;
          } else {
            spriteX=1;
            spriteY=0;
          }
        } else if (lastPosition[i].y > lastPosition[i-1].y){
          //lastPosition moving up
          if (lastPosition[i].x > lastPosition[i+1].x) {
            spriteX=2;
            spriteY=2;
          } else if (lastPosition[i].x < lastPosition[i+1].x){
            spriteX= 0;
            spriteY=1;
          } else {
            spriteX=2;
            spriteY=1;
          }
        } else {
          // lastPosition moving down
          if (lastPosition[i].x > lastPosition[i+1].x) {
            spriteX=2;
            spriteY=0;
          } else if (lastPosition[i].x < lastPosition[i+1].x) {
            spriteX=0;
            spriteY=0;
          } else {
            spriteX =2;
            spriteY=1;
          }
        }
      }
      ctx.drawImage(snakeImage, spriteX*64, spriteY*64, 64, 64, lastPosition[i].x*cell, lastPosition[i].y*cell, cell, cell);
    }
  }
}

//clear/reset the canvas
function clearCanvas()
{
  ctx.fillStyle = '#0c5831';
  ctx.fillRect(0, 0, width, height);
  ctx. strokeStyle = 'white';
  ctx.strokeRect(0, 0, width, height);
}

//if snake hits the wall or hits its body, game ends
function checkGameover()
{
  if (headX < 0 || headX == width/cell || headY < 0 || headY == height/cell || hitBody(headX, headY, snake) || lives <= 0)
  {
    if (lives > 0)
    {
      document.getElementById("collide").currentTime = 0;
      document.getElementById("collide").play();
    }
    for (var i=0;i<snake.length;i++) {
      lastPosition.splice(i, 1, {x:snake[i].x,y:snake[i].y});
    }
    snake.splice(0, snake.length);
    for (var j=0;j<lastPosition.length;j++) {
      paint(lastPosition[j].x, lastPosition[j].y, 'lastPosition');
    }
    gameOver = true;
    gameStart = false;
    clearTimeout(gamerun);
    setTimeout(function(){
      ctx.fillStyle = "rgba(100,100,100,0.5)";
      ctx.fillRect(0,0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Press spacebar or tap to retry", 20, 240);
    }, 50);
  }
}

//check to see if snake head is on snake body
function hitBody(x, y, array)
{
  for (var i = 1; i < array.length; i++)
  {
    if (x == array[i-1].x && y == array[i-1].y)
      return true;
  }
}

//reset the whole game
function reset()
{
  lastPosition = [];
  poisonNum = 4;
  lives = 3;
  snake = [{x:-1,y:0}];
  headX = snake[0].x; headY = snake[0].y;
  tail = null;
  frogX = null; frogY = null;
  vx = 20; vy = 0;
  dir = 'right'; newdir = 'right';
  frame = 150;
  score = 0;
  keyDisabled = true;
  clearInterval(speedInc);
  clearTimeout(gamerun);
  clearInterval(timecount);
  time = 0;
}

function timer()
{
  min = Math.floor(time/60);
  sec = time%60;
  if (min < 10){ min = "0" + min;}
  if (sec < 10){ sec = "0" + sec;}
  timecount = setInterval(function(){
    time++;
    min = Math.floor(time/60);
    sec = time%60;
    if (min < 10){ min = "0" + min;}
    if (sec < 10){ sec = "0" + sec;}
  }, 1000);
}

function displayTime()
{
  ctx.font = "12px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Time : " + min + " : " + sec, 370, 440);
}

function displayLives()
{
  ctx.font = "12px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Life : " + lives, 200, 440);
}

$(window).on("keydown", function(e)
{
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


$(".backIcon").on("click", function(){
  window.history.back();
});



$(".soundIcon").on("click", function(){
  if (soundon)
  {
    this.src = "assets/img/soundoff.png";
    soundon = false;
    if (!BGM.paused) {
      BGM.pause();
    }
  }
  else
  {
    this.src = "assets/img/soundon.png";
    soundon = true;
    if (BGM.paused && gameStart) {
      BGM.play();
    }
  }
});
