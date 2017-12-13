//****************Customization******************//
var showtime = 8; //initial card display time in seconds
var timesetting = 8; //first player's time limit
var maxscore = 10; //goal score to end the game
//***********************************************//

//instruction lines for customizable variables
document.getElementById("startInstruction").innerHTML = "All card values will be displayed for " + showtime + ' seconds when you press "START"';
document.getElementById("limitInstruction").innerHTML = "First person for the buzzer will get " + timesetting + " seconds time limit, but will be rewarded with double points.";
document.getElementById("goalInstruction").innerHTML = "Whoever scores " + maxscore + " points first wins the game!";

var soundon=true;
var BGM = document.getElementById("bgm");
BGM.volume = 0.3;
var gameStarted = false;


//no cursor effect before players get turns
for (var i = 0; i < 16; i++)
{
  document.getElementById(i).style.pointerEvents = 'none';
}

//initialize card pool (front and back)
var pool = [1,2,3,4,5,6,7,8,9,10,11,12,'+','-','x','÷'];
var poolback = ['A', 'L', 'I', 'E', 'Y', 'O', 'U', 'M', 'S', 'T', 'N', 'R', 'H', 'D', 'G', 'K'];
//give each card alphabet back cover
for (var i = 0; i < 16; i++)
{
  document.getElementById(i).innerHTML = poolback[i];
}
//shuffle the pool order
function shufflearray(array)
{
  var temp;
  for (var i = array.length-1; i >= 0; i--)
  {
       var randomIndex = Math.floor(Math.random()*(i+1));
       var itemAtIndex = array[randomIndex];

       array[randomIndex] = array[i];
       array[i] = itemAtIndex;
   }
}


//start button will show all array values for 10 sec
var gamestarted = false;

function gameStart()
{
  shufflearray(pool);
  for(var i = 0; i < 16; i++)
  {
    document.getElementById(i).style.backgroundColor = "white";
    document.getElementById(i).style.color = "black";
    document.getElementById(i).innerHTML = pool[i];
  }
  document.getElementById("target").style.color = "#A9A9A9";
  countDown(showtime, "target");
  setTimeout(function(){
    for(var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.backgroundColor = "#8B4513";
      document.getElementById(i).style.color = "white";
      document.getElementById(i).innerHTML = poolback[i];
    }
  document.getElementById("target").style.color = "black";
    displayTarget();
    gamestarted = true;
    buzzerclick();
  }, showtime*1000);
}

$("#start").on("click", function(){
  gameStart();
  gameStarted= true;
  if (soundon) {
    BGM.play();
  }
  this.disabled = true;
  this.style.pointerEvents = 'none';
});

//generate target number (all possible values derived from array values)
var allvalues = [1,2,3,4,5,6,7,8,9,10,11,12];

var targetNumbers = [1,2]; //the only two non-repeating differences and quotient.

function allSum()
{
  for (var i = 0; i < allvalues.length; i++)
  {
    for (var j = 1; j < allvalues.length - (i+1); j++)
    {
      var sum = allvalues[i] + allvalues[i+j];
      if (targetNumbers.indexOf(sum) === -1)
        targetNumbers.push(sum);
    }
  }
}
allSum();
function allProduct()
{
  for (var i = 0; i < allvalues.length; i++)
  {
    for (var j = 1; j < allvalues.length - (i+1); j++)
    {
      var product = allvalues[i] * allvalues[i+j];
      if (targetNumbers.indexOf(product) === -1)
        targetNumbers.push(product);
    }
  }
}
allProduct();

//generate and display target number
function displayTarget(){
  var ranNum = Math.floor(Math.random() * targetNumbers.length);
  document.getElementById("target").innerHTML = targetNumbers[ranNum];
}

//keypress functions
//press z(122) for player 1 turn, / (47) for player 2 turn
var player1turn = false, player2turn = false, timelimit = true;

$(window).on("keypress", function(e){
  var keyCode = e.keyCode;
  if (keyCode === 122 && gamestarted && !player1turn && !player2turn)
  {
    player1turn = true;
    document.getElementById("beep").play();
    turns();
  }
  else if (keyCode === 47 && gamestarted && !player1turn && !player2turn)
  {
    player2turn = true;
    document.getElementById("beep").play();
    turns();
  }
});

//players' turns buzzer
var time = timesetting;

function turns(){
  if (player1turn)
  {
    buzzerclick();
    for (var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.pointerEvents = 'auto';
    }
    document.getElementById("player1buzzer").src = "assets/img/buzzeron.png";
    document.getElementById("player2buzzer").src = "assets/img/buzzeroff.png";
    if (timelimit)
    {
      countDown(time, "player1timer");
    }
    else
    {
      document.getElementById("player1timer").innerHTML = " ∞ ";
    }
  }
  else if (player2turn)
  {
    buzzerclick();
    for (var j = 0; j < 16; j++)
    {
      document.getElementById(j).style.pointerEvents = 'auto';
    }
    document.getElementById("player2buzzer").src = "assets/img/buzzeron.png";
    document.getElementById("player1buzzer").src = "assets/img/buzzeroff.png";
    if (timelimit)
    {
      countDown(time, "player2timer");
    }
    else
    {
      document.getElementById("player2timer").innerHTML = " ∞ ";
    }
  }
  else
  {
    document.getElementById("player1buzzer").src = "assets/img/buzzeroff.png";
    document.getElementById("player2buzzer").src = "assets/img/buzzeroff.png";
  }
}

//when clicked, a card is flipped(up to three at once).
//different events during player1's and player2's turn
var cardflipped = 0;
var flipped = [];

$(".card").on("click",function(){
  document.getElementById("cardclick").currentTime = 0;
  document.getElementById("cardclick").play();
  this.style.backgroundColor = "white";
  this.style.color = "black";
  this.innerHTML = pool[this.id];
  cardflipped++;
  flipped.push(pool[this.id]);
  this.style.pointerEvents = 'none';
  checkValid(flipped);
  if (cardflipped === 3)
  {
    for (var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.pointerEvents = 'none';
    }
    if (arithmetic() == document.getElementById("target").innerHTML)
    {
      if (player1turn)
      {
        window.clearTimeout(timer);
        time = timesetting;
        if (timelimit)
          score1+=2;
        else
          score1++;
        timelimit = true;
        player1turn = false;
        turns();
        document.getElementById("correctbeep").play();
        setTimeout(function(){
          displayScore();
          displayTarget();
        }, 1000);
      }
      else if(player2turn)
      {
        window.clearTimeout(timer);
        time = timesetting;
        if (timelimit)
          score2+=2;
        else
          score2++;
        timelimit = true;
        player2turn = false;
        turns();
        document.getElementById("correctbeep").play();
        setTimeout(function(){
          displayScore();
          displayTarget();
        }, 1000);
      }
      buzzerclick();
    }
    else
    {
      window.clearTimeout(timer);
      setTimeout(function(){
        losechance();
      }, 500);
    }
    setTimeout(function(){
      for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
      }
    }, 1000);
    cardflipped = 0;
    flipped = [];
    document.getElementById("player1timer").innerHTML = null;  document.getElementById("player2timer").innerHTML = null;
  }
});

//special effect (opacity change) when mouse hovers on cards
$(".card").mouseover(function(){
  document.getElementById(this.id).style.opacity = "0.8";
});
$(".card").mouseout(function(){
  document.getElementById(this.id).style.opacity = "1";
});

//If first card is not number or if second card is not an operator, discard the turn at once.
function checkValid(array)
{
  if (isNaN(array[0]))
  {
    for (var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.pointerEvents = 'none';
    }
    setTimeout(function(){
      for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
      }
      flipped = [];
    }, 500);
    cardflipped = 0;
    window.clearTimeout(timer);
    setTimeout(function(){
      losechance();
    }, 500);
  document.getElementById("player1timer").innerHTML = null;  document.getElementById("player2timer").innerHTML = null;
  }
  if (!isNaN(array[1]))
  {
    for (var j = 0; j < 16; j++)
    {
      document.getElementById(j).style.pointerEvents = 'none';
    }
    setTimeout(function(){
      for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
      }
      flipped = [];
    }, 500);
    cardflipped = 0;
    window.clearTimeout(timer);
    setTimeout(function(){
      losechance();
    }, 500);
    document.getElementById("player1timer").innerHTML = null;  document.getElementById("player2timer").innerHTML = null;
  }
}

//mechanism for force turn change
function losechance(){
  timelimit = false;
  window.clearTimeout(timer);
  time = 8;
  cardflipped = 0;
  flipped = [];
  if (player1turn)
  {
    document.getElementById("player1timer").innerHTML = null;
    player1turn = false;
    player2turn = true;
  }
  else if (player2turn)
  {
    document.getElementById("player2timer").innerHTML = null;
    player2turn = false;
    player1turn = true;
  }
  setTimeout(function()
  {
    turns();
    document.getElementById("wrongbeep").play();
  }, 500);
}


//arithmetic for the combination of three values
//check if it matches the target values
function arithmetic()
{
  var combination;
  if (flipped[1] === '+')
  {
    combination = flipped[0] + flipped[2];
  }
  else if (flipped[1] === '-')
  {
    combination = flipped[0] - flipped[2];
  }
  else if (flipped[1] === 'x')
  {
    combination = flipped[0] * flipped[2];
  }
  else if (flipped[1] === '÷')
  {
    combination = flipped[0]/flipped[2];
  }
  else {
    combination = null;
  }
  return combination;
}

//calculate and display score
var score1 = 0, score2 = 0;
function displayScore(){
  document.getElementById("player1score").innerHTML = "Score : " + score1;
  document.getElementById("player2score").innerHTML = "Score : " + score2;
  gameover();
}

//endgame objective
function gameover(){
  if (score1 >= maxscore || score2 >= maxscore)
  {
    document.getElementById("target").style.color = "white";
    setTimeout(function(){
      document.getElementById("gameover").style.opacity = "0.8";
      document.getElementById("gameover").style.zIndex = "1";
      gamestarted = false;
      document.getElementById("start").innerHTML = "REMATCH";
      document.getElementById("start").disabled = false;
      document.getElementById("start").style.pointerEvents = 'auto';
      $("#start").on("click", function(){
        reset();
        gameStart();
      });
      if (score1 >= maxscore)
      {
        document.getElementById("gameover").innerHTML = "Player 1 Won!";
      }
      else if (score2 >= maxscore)
      {
        document.getElementById("gameover").innerHTML = "Player 2 Won!";
      }
    }, 500);
  }
}

function reset()
{
  document.getElementById("gameover").style.opacity = "0";
  document.getElementById("gameover").style.zIndex = "-1";
  document.getElementById("gameover").innerHTML = "";
  score1 = 0;
  score2 = 0;
  displayScore();
  gameStarted = false;
  player1turn = false;
  player2turn = false;
  timelimit = true;
  time = timesetting;
  cardflipped = 0;
  flipped = [];
}

//countdown timer for game start and first turn
var timer, timer2;

function countDown(sec, elem){
  var element = document.getElementById(elem);
  if (sec > 0 && gamestarted)
  {
    element.innerHTML = sec--;
    if (sec < 3)
    {
      document.getElementById("timerbeep").volume = 0.05;
      document.getElementById("timerbeep").currentTime = 0;
      document.getElementById("timerbeep").play();
    }
    timer = setTimeout('countDown('+sec+',"'+elem+'")', 1000);
  }
  else if (sec === 0 && gamestarted)
  {
    window.clearTimeout(timer);
    if (player1turn)
      document.getElementById("player1timer").innerHTML = null;
    else if (player2turn)
      document.getElementById("player2timer").innerHTML = null;
    for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.pointerEvents = 'none';
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
      }
    losechance();
  }
  else if (!gamestarted)
  {
    element.innerHTML = sec--;
    document.getElementById("timerbeep").volume = 0.05;
    document.getElementById("timerbeep").currentTime = 0;
    document.getElementById("timerbeep").play();
    timer2 = setTimeout('countDown('+sec+',"'+elem+'")', 1000);
    if (sec === 0)
    {
      window.clearTimeout(timer2);
    }
  }
}


//for mobile-friendly. buzzer clickable
document.getElementById("player1buzzer").style.pointerEvents = 'none';
document.getElementById("player2buzzer").style.pointerEvents = 'none';
function buzzerclick()
{
  if (gamestarted && !player1turn && !player2turn)
  {
    document.getElementById("player1buzzer").style.pointerEvents = 'auto';
    document.getElementById("player2buzzer").style.pointerEvents = 'auto';
  }
  else
  {
    document.getElementById("player1buzzer").style.pointerEvents = 'none';
    document.getElementById("player2buzzer").style.pointerEvents = 'none';
  }
}
$("#player1buzzer").on("click", function()
{
  player1turn = true;
  document.getElementById("beep").play();
  turns();
});
$("#player2buzzer").on("click", function()
  {
    player2turn = true;
    document.getElementById("beep").play();
    turns();
  });


window.onload = function()
{
  document.getElementById("beep").volume = 0.5;
};

$(".backIcon").on("click", function() {
  window.history.back();
});

$(".soundIcon").on("click", function() {
  if (soundon) {
    this.src = "assets/img/soundoff.png";
    soundon = false;
    if (!BGM.paused) {
      BGM.pause();
    }
  } else {
    this.src = "assets/img/soundon.png";
    soundon = true;
    if (BGM.paused && gameStarted) {
      BGM.play();
    }
  }
});
