var gamearea = document.getElementById("gamearea");
var width = gamearea.width;
var height = gamearea.height;
var ctx = gamearea.getContext("2d");
var snake = [{x:-1,y:0}];
var snake2 = [{x: 15, y: 14}];
var headX = snake[0].x, headY = snake[0].y;
var headX2 = snake2[0].x, headY2 = snake2[0].y;
var tail;
var tail2;
var frogX, frogY;
var frogX2, frogY2;
// var poison = [];
var dir = 'right', newdir = 'right';
var dir2 = 'left', newdir2 ='left';
var cell = 30;
var frame = 150;
var score = 0;
var score2 = 0;
var gamerun;
var speedInc;
var keyDisabled = true;
var gameStart = false;
var gameOver = false;
var gameOver2 = false;
var keyMap=[];
var timecount;
var time = 0;
var min, sec;
var soundon =true;
var lives = 3;
var lives2 = 3;
var paused = false;

var snakeImage = new Image();
snakeImage.src = 'assets/img/snake-sprite-yellow.png';
var snake2Image = new Image();
snake2Image.src = 'assets/img/snake-sprite-red.png'
var frogImage = new Image();
frogImage.src = 'assets/img/frog.png';

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
ctx.fillText("Press spacebar to begin", 60, 250);

//keybinding
$(window).on("keydown", function(e)
{
  if (e.keyCode == 32 && !gameStart)
  {
    if(gameOver)
    {
      reset();
    }
    startGame();
    gameStart = true;
  } else if (e.keyCode == 32 && gameStart) {
    pauseGame();
  };
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
  } else {
    clearInterval(timecount);
    clearInterval(speedInc);
  }
  keyDisabled=!keyDisabled;
  paused = !paused;
  ctx.fillStyle = "rgba(100,100,100,0.5)";
  ctx.fillRect(0,0, width, height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Game Paused", 130, 250);
  update();
};

$(window).on("keyup", function(e)
{
  keyMap[e.keyCode] = false;
});

//Spacebar(keyCode 32) will trigger startGame function
//Create snake, frog(food), and initialize the animation every //frame
function startGame()
{
  if (soundon) {
    BGM.play();
  }
  createSnake();
  createSnake2();
  // createPoison();
  createFrog();
  createFrog2();
  timer();
  setInterval(function(){
    if (keyMap[39] && dir2 != 'left' && !keyDisabled)
    {
      newdir2 = 'right';
    }
    if (keyMap[37] && dir2 != 'right' && !keyDisabled)
    {
      newdir2 = 'left';
    }
    if (keyMap[38] && dir2 != 'down' && !keyDisabled)
    {
      newdir2 = 'up';
    }
    if (keyMap[40] && dir2 != 'up' && !keyDisabled)
    {
      newdir2 = 'down';
    }
    if (keyMap[68] && dir != 'left' && !keyDisabled)
    {
      newdir = 'right';
    }
    if (keyMap[65] && dir != 'right' && !keyDisabled)
    {
      newdir = 'left';
    }
    if (keyMap[87] && dir != 'down' && !keyDisabled)
    {
      newdir = 'up';
    }
    if (keyMap[83] && dir != 'up' && !keyDisabled)
    {
      newdir = 'down';
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
  for (var i = 0; i < 2; i++)
  {
    snake.push({x: i, y: 0});
  }
}

function createSnake2()
{
  for (var i = 24; i > 22; i--)
  {
    snake2.push({x: i, y: 22});
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
    if (frogX == snake[i].x && frogY == snake[i].y)
    {
      createFrog();
    }
  }
  for (var j=0;j<snake2.length;j++) {
    if(frogX ==snake2[j].x && frogY == snake2[j].y) {
      createFrog();
    }
  }
}
function createFrog2()
{
  var ranNum = Math.floor(Math.random()*(width/cell));
  frogX2 = ranNum;
  ranNum = Math.floor(Math.random()*(height/cell));
  frogY2 = ranNum;
  for (var i = 0; i < snake.length; i++)
  {
    if (frogX2 == snake[i].x && frogY2 == snake[i].y) {
      createFrog2();
    }
  }
  for (var j=0;j<snake2.length;j++) {
    if(frogX2 ==snake2[j].x && frogY2 == snake2[j].y) {
      createFrog2();
    }
  }
}

// function createPoison()
// {
//   for (var k = 0; k < poisonNum; k++)
//   {
//     var ranNum = Math.floor(Math.random()*(width/cell));
//     var ranNum2 = Math.floor(Math.random()*23);
//     poison[k] = {x: ranNum, y:ranNum2};
//   }
//   for (var i = 0; i < snake.length; i++)
//   {
//     for (var j = 0; j < poisonNum; j++)
//     {
//       for (var l = 0; l < snake2.length; l++)
//      {
//         if ((poison[j].x == snake[i].x && poison[j].y == snake[i].y) || (poison[j].x == frogX && poison[j].y == frogY) || (poison[j].x == snake2[l].x && poison[j].y == snake2[l].y))
//           createPoison();
//       }
//     }
//   }
// }

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
  if (!gameOver && !paused|| !gameOver2 && !paused)
  {
    clearCanvas();
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 460, width, 40);
    if (!gameOver)
    {
      direction(newdir);
      dir = newdir;
    }
    if (!gameOver2)
    {
      direction2(newdir2);
      dir2 = newdir2;
    }
    if (!keyDisabled)
    {
      checkGameover();
      checkGameover2();
      hitOtherBody();
    }
    if (headX == frogX && headY == frogY && !gameOver)
    {
      document.getElementById("eat").currentTime = 0.3;
      document.getElementById("eat").play();
      tail = {x: headX, y: headY};
      score++;
      // if ((score+score2)%4 === 0)
      // {
      //   poisonIncrease();
      // }
      // createPoison();
      createFrog();
      if (!gameOver2)
      {
        tail2 = snake2.pop();
        tail2.x = headX2;
        tail2.y = headY2;
      }
    }
    else if (headX == frogX2 && headY == frogY2 && !gameOver)
    {
      document.getElementById("eat").currentTime = 0.3;
      document.getElementById("eat").play();
      tail = {x: headX, y: headY};
      score++;
      // if ((score+score2)%4 === 0)
      // {
      //   poisonIncrease();
      // }
      // createPoison();
      createFrog2();
      if (!gameOver2)
      {
        tail2 = snake2.pop();
        tail2.x = headX2;
        tail2.y = headY2;
      }
    }
    else if (headX2 == frogX && headY2 == frogY && !gameOver2)
    {
      document.getElementById("eat").currentTime = 0.3;
      document.getElementById("eat").play();
      tail2 = {x: headX2, y: headY2};
      score2++;
      // if ((score+score2)%5 === 0)
      // {
      //   poisonIncrease();
      // }
      // createPoison();
      createFrog();
      if (!gameOver)
      {
        tail = snake.pop();
        tail.x = headX;
        tail.y = headY;
      }
    }
    else if (headX2 == frogX2 && headY2 == frogY2 && !gameOver2)
    {
      document.getElementById("eat").currentTime = 0.3;
      document.getElementById("eat").play();
      tail2 = {x: headX2, y: headY2};
      score2++;
      // if ((score+score2)%5 === 0)
      // {
      //   poisonIncrease();
      // }
      // createPoison();
      createFrog2();
      if (!gameOver)
      {
        tail = snake.pop();
        tail.x = headX;
        tail.y = headY;
      }
    }
    else
    {
      if (!gameOver)
      {
      tail = snake.pop();
      tail.x = headX;
      tail.y = headY;
      }
      if (!gameOver2)
      {
      tail2 = snake2.pop();
      tail2.x = headX2;
      tail2.y = headY2;
      }
    }
    // for (var i = 0; i < poisonNum; i++)
    // {
    //   if (!gameOver)
    //   {
    //     if (headX == poison[i].x && headY == poison[i].y)
    //     {
    //       document.getElementById("dead").currentTime = 0;
    //       document.getElementById("dead").play();
    //       lives--;
    //       tail.x = headX;
    //       tail.y = headY;
    //       createFrog();
    //       createPoison();
    //     }
    //   }
    //   if (!gameOver2)
    //   {
    //     if (headX2 == poison[i].x && headY2 == poison[i].y)
    //     {
    //       document.getElementById("dead").currentTime = 0;
    //       document.getElementById("dead").play();
    //       lives2--;
    //       tail2.x = headX2;
    //       tail2.y = headY2;
    //       createFrog();
    //       createPoison();
    //     }
    //   }
    // }
    if (!gameOver)
    {
      snake.unshift(tail);
      for (var j = 0; j < snake.length; j++)
      {
        paint(snake[j].x,snake[j].y, 'snake');
      }
    }
    if (!gameOver2)
    {
      snake2.unshift(tail2);
      for (var l = 0; l < snake2.length; l++)
      {
        paint(snake2[l].x, snake2[l].y, 'snake2');
      }
    }
    // for (var k = 0; k < poisonNum; k++)
    // {
    //   paint(poison[k].x, poison[k].y, 'poison');
    // }
    paint(frogX, frogY, 'frog');
    paint(frogX2,frogY2,'frog');
    displayTime();
    displayScore();
    // displayLives();
    gamerun = setTimeout(update, frame);
  }
}

// function poisonIncrease()
// {
//   if (poisonNum < 8)
//     poisonNum++;
// }

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

function direction2(d)
{
  if(d == 'right')
    headX2++;
  if(d == 'left')
    headX2--;
  if (d == 'up')
    headY2--;
  if (d == 'down')
    headY2++;
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
  else if (who == 'snake2')
  {
    for (var i=0; i<snake2.length; i++) {
      var spriteX = 0;
      var spriteY = 0;
      if (i===0) {
        if (newdir2 == 'up') {
          spriteX = 3;
          spriteY = 0;
        } else if (newdir2 == 'down') {
          spriteX = 4;
          spriteY = 1;
        } else if (newdir2 == 'left') {
          spriteX = 3;
          spriteY = 1;
        } else {
          spriteX = 4;
          spriteY = 0;
        }
      } else if (i===snake2.length-1) {
        if (snake2[i].y > snake2[i-1].y) {
          //snake2 tail is following upwards
          spriteX = 3;
          spriteY = 2;
        } else if (snake2[i].y < snake2[i-1].y) {
          // snake2 tail is following downwards
          spriteX = 4;
          spriteY = 3;
        } else if (snake2[i].x > snake2[i-1].x ) {
          //snake2 tail going left
          spriteX = 3;
          spriteY = 3;
        } else {
          //snake2 tail going right
          spriteX = 4;
          spriteY = 2;
        }
      } else {
        if (snake2[i].x < snake2[i-1].x) {
          // snake2 heading right
          if (snake2[i].y < snake2[i+1].y) {
            spriteX = 0;
            spriteY=0;
          } else if (snake2[i].y > snake2[i+1].y) {
            spriteX = 0;
            spriteY = 1;
          } else {
            spriteX = 1;
            spriteY=0;
          }
        } else if (snake2[i].x > snake2[i-1].x) {
          //snake2 heading left
          if (snake2[i].y < snake2[i+1].y) {
            spriteX=2;
            spriteY=0;
          } else if (snake2[i].y > snake2[i+1].y) {
            spriteX=2;
            spriteY=2;
          } else {
            spriteX=1;
            spriteY=0;
          }
        } else if (snake2[i].y > snake2[i-1].y){
          //snake2 moving up
          if (snake2[i].x > snake2[i+1].x) {
            spriteX=2;
            spriteY=2;
          } else if (snake2[i].x < snake2[i+1].x){
            spriteX= 0;
            spriteY=1;
          } else {
            spriteX=2;
            spriteY=1;
          }
        } else {
          // snake2 moving down
          if (snake2[i].x > snake2[i+1].x) {
            spriteX=2;
            spriteY=0;
          } else if (snake2[i].x < snake2[i+1].x) {
            spriteX=0;
            spriteY=0;
          } else {
            spriteX =2;
            spriteY=1;
          }
        }
      }
      ctx.drawImage(snake2Image, spriteX*64, spriteY*64, 64, 64, snake2[i].x*cell, snake2[i].y*cell, cell, cell);
    }
  }
  else if (who == 'frog')
  {
    ctx.drawImage(frogImage, x*cell, y*cell, cell, cell);
  }
  // else if (who == 'poison')
  // {
  //   ctx.fillStyle = 'red';
  //   ctx.strokeStyle = 'white';
  //   ctx.beginPath();
  //   ctx.arc((x+0.5)*cell, (y+0.5)*cell, cell/2 - 3, 0, 2*Math.PI);
  //   ctx.stroke();
  //   ctx.fill();
  // }
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
  if (headX == -1 || headX == width/cell || headY == -1 || headY == height/cell || hitBody(headX, headY, snake) || lives === 0)
  {
    if (lives!=0 && !gameOver)
    {
      document.getElementById("collide").currentTime = 0;
      document.getElementById("collide").play();
    }
    gameOver = true;
    snake.splice(0, snake.length);
    if (gameOver && gameOver2)
    {
      checkWinner();
    }
  }
}
function checkGameover2()
{
  if (headX2 == -1 || headX2 == width/cell || headY2 == -1 || headY2 == height/cell || hitBody(headX2, headY2, snake2) || lives2 === 0)
  {
    if (lives2!=0 && !gameOver2)
    {
      document.getElementById("collide").currentTime = 0;
      document.getElementById("collide").play();
    }

    gameOver2 = true;
    snake2.splice(0, snake2.length);
    if (gameOver && gameOver2)
    {
      checkWinner();
    }
  }
}

function checkWinner() {
  if (score > score2) {
    setTimeout(function(){
      ctx.fillStyle = "rgba(100,100,100,0.5)";
      ctx.fillRect(0,0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("PLAYER 1 WON!", 110, 250);
      gameStart = false;
    }, 150);
  } else if (score < score2) {
    setTimeout(function(){
      ctx.fillStyle = "rgba(100,100,100,0.5)";
      ctx.fillRect(0,0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("PLAYER 2 WON!", 110, 250);
      gameStart = false;
    }, 150);
  } else {
    setTimeout(function(){
      ctx.fillStyle = "rgba(100,100,100,0.5)";
      ctx.fillRect(0,0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("DRAW", 180, 250);
      gameStart = false;
    }, 150);
  }
}

//check to see if snake head is on snake body
function hitBody(x, y, array)
{
  for (var i = 1; i < array.length; i++)
  {
    if (x == array[i-1].x && y == array[i-1].y && array.length > 3)
      return true;
  }
}

function hitOtherBody()
{
  for (var k = 1; k < snake2.length; k++)
  {
    if (headX == snake2[k].x && headY == snake2[k].y && !gameOver2)
    {
      document.getElementById("collide").currentTime = 0;
      document.getElementById("collide").play();
      gameOver = true;
      snake.splice(0, snake.length);
      headX = null;
      headY = null;
    }
  }
  for (var j = 1; j < snake.length; j++)
  {
    if (headX2 == snake[j].x && headY2 == snake[j].y && !gameOver)
    {
      document.getElementById("collide").currentTime = 0;
      document.getElementById("collide").play();
      gameOver2 = true;
      snake2.splice(0, snake2.length);
      headX2 = null;
      headY2 = null;
    }
  }
  if (headX == headX2 && headY == headY2 && headX != null && headX2 != null)
  {
    document.getElementById("collide").currentTime = 0;
    document.getElementById("collide").play();
    setTimeout(function(){
      ctx.fillStyle = "rgba(100,100,100,0.5)";
      ctx.fillRect(0,0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("DRAW", 180, 250);
      gameStart = false;
    }, 150);
    gameOver = true;
    gameOver2 = true;
    snake.splice(0, snake.length);
    snake2.splice(0, snake2.length);
  }
}

//reset the whole game
function reset()
{
  // poisonNum = 4;
  lives = 3;
  lives2 = 3;
  snake = [{x:-1,y:0}];
  snake2 = [{x: 15, y: 14}];
  headX = snake[0].x; headY = snake[0].y;
  headX2 = snake2[0].x; headY2 = snake2[0].y;
  tail = null;
  tail2 = null;
  frogX = null; frogY = null;
  dir = 'right'; newdir = 'right';
  dir2 = 'left'; newdir2 = 'left';
  frame = 150;
  score = 0;
  score2 = 0;
  keyDisabled = true;
  time = 0;
  clearInterval(speedInc);
  clearTimeout(gamerun);
  clearInterval(timecount);
  gameOver = false;
  gameOver2 = false;
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
  ctx.fillText("Time : " + min + " : " + sec, 200, 440);
}

// function displayLives()
// {
//   ctx.font = "12px Arial";
//   ctx.fillStyle = "white";
//   ctx.fillText("Player 1", 10, 475);
//   ctx.fillText("Life : " + lives, 10, 490);
//   ctx.fillText("Player 2", 450, 475);
//   ctx.fillText("Life : " + lives2, 457, 490);
// }
//display Scoreboard
function displayScore()
{
  ctx.font = "12px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score : " +score, 20, 440);
  ctx.fillText("Score : " +score2, 370, 440);
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
