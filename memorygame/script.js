var soundon=true;
var BGM = document.getElementById("bgm");
BGM.volume = 0.3;
var gameStarted = false;

document.getElementById("hint").disabled = true;
document.getElementById("hint").style.pointerEvents = 'none';
for (var i = 0; i < 16; i++)
{
  document.getElementById(i).style.pointerEvents = 'none';
}
//initialize card pool
var pool = [1,2,3,4,5,6,7,8,9,10,11,12,'+','-','x','÷'];
var poolback = ['A', 'L', 'I', 'E', 'Y', 'O', 'U', 'M', 'S', 'T', 'N', 'R', 'H', 'D', 'G', 'K'];
//shuffle the order
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

for (var i = 0; i < 16; i++)
{
  document.getElementById(i).innerHTML = poolback[i];
}


var score = 0;
var attempt = 1;
// button will show all array values for 5 sec

function gameStart()
{
  shufflearray(pool);
  for(var i = 0; i < 16; i++)
  {
    document.getElementById(i).style.backgroundColor = "white";
    document.getElementById(i).style.color = "black";
    document.getElementById(i).innerHTML = pool[i];
  }
  setTimeout(function(){
    for(var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.backgroundColor = "#8B4513";
      document.getElementById(i).style.color = "white";
      document.getElementById(i).innerHTML = poolback[i];
      document.getElementById(i).style.pointerEvents = 'auto';
    }
    displayTarget();
    displayScore();
    displayAttempt();
    document.getElementById("hint").disabled = false;
    document.getElementById("hint").style.pointerEvents = 'auto';
    timer();
  }, 10000);
  document.getElementById("start").style.pointerEvents = 'none';
}

$("#start").on("click", function()
{
  gameStart();
  gameStarted= true;
  if (soundon) {
    BGM.play();
  }
  this.disabled = true;
});

//generate target number (all possible values derived from array values)
var allvalues = [1,2,3,4,5,6,7,8,9,10,11,12];

var targetNumbers = [1,2];

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

//display target number
function displayTarget(){
  var ranNum = Math.floor(Math.random() * targetNumbers.length);
  document.getElementById("target").innerHTML = targetNumbers[ranNum];
}

//when clicked, a card is flipped(up to three at once).
//check if first value is an operator, flips back, loses an attempt
//if second value is a number, flips back, loses an attempt
var cardflipped = 0;

var flipped = [];


$(".card").on("click",function(){
  document.getElementById("hint").style.pointerEvents = 'none';
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
    if (arithmetic() == document.getElementById("target").innerHTML)
    {
      score++;
      document.getElementById("correctbeep").play();
      displayTarget();
    }
    else {
      setTimeout(function()
    {
      document.getElementById("wrongbeep").volume = 0.2;
      document.getElementById("wrongbeep").play();
    }, 500);
    }
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
        document.getElementById(i).style.pointerEvents = 'auto';
      }
      document.getElementById("hint").style.pointerEvents = 'auto';
      attempt++;
      displayScore();
      displayAttempt();
      flipped = [];
    }, 500);
    cardflipped = 0;
  }
});

$(".card").mouseover(function(){
  document.getElementById(this.id).style.opacity = "0.8";
});
$(".card").mouseout(function(){
  document.getElementById(this.id).style.opacity = "1";
});

function checkValid(array)
{
  if (isNaN(array[0]))
  {
    for (var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.pointerEvents = 'none';
    }
    setTimeout(function(){
      document.getElementById("wrongbeep").volume = 0.2;
      document.getElementById("wrongbeep").play();
      for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
        document.getElementById(i).style.pointerEvents = 'auto';
      }
      document.getElementById("hint").style.pointerEvents = 'auto';
      attempt++;
      displayScore();
      displayAttempt();
      flipped = [];
    }, 500);
    cardflipped = 0;
  }
  if (!isNaN(array[1]))
  {
    for (var j = 0; j < 16; j++)
    {
      document.getElementById(j).style.pointerEvents = 'none';
    }
    setTimeout(function(){
      document.getElementById("wrongbeep").volume = 0.2;
      document.getElementById("wrongbeep").play();
      for(var i = 0; i < 16; i++)
      {
        document.getElementById(i).style.backgroundColor = "#8B4513";
        document.getElementById(i).style.color = "white";
        document.getElementById(i).innerHTML = poolback[i];
        document.getElementById(i).style.pointerEvents = 'auto';
      }
      document.getElementById("hint").style.pointerEvents = 'auto';
      attempt++;
      displayScore();
      displayAttempt();
      flipped = [];
    }, 500);
    cardflipped = 0;
  }
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
function displayScore()
{
  document.getElementById("score").innerHTML = score;
}



//attempt added for every target number, 0 -> 10 end of game
function displayAttempt()
{
  document.getElementById("attempt").innerHTML = attempt;
  if (attempt > 10)
  {
    for(var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.pointerEvents = 'none';
      document.getElementById("attempt").innerHTML = 10;
    }
    setTimeout(function(){
        endgame();
    }, 500);
  }
}
var timecount;
function endgame()
{
  clearInterval(timecount);
  document.getElementById("target").innerHTML = null;
  document.getElementById("attempt").innerHTML = null;
  document.getElementById("hint").disabled = true;
  document.getElementById("hint").style.pointerEvents = 'none';
  document.getElementById("gameover").style.opacity = 0.8;
  document.getElementById("gameover").style.zIndex = 1;
  document.getElementById("gameover").innerHTML = "Game Over";
  document.getElementById("start").innerHTML = "RETRY";
  document.getElementById("start").disabled = false;
  document.getElementById("start").style.pointerEvents = 'auto';
  $("#start").on("click",function(){
    reset();
    gameStart();
  });
}
//timer
var min = 0, sec = 0;

function timer()
{
  document.getElementById("time").innerHTML = "00 : 00";
  timecount = setInterval(function(){
    sec++;
    if (sec > 59)
    {
      sec = 0;
      min++;
    }
    if (min < 10 && sec < 10)
      document.getElementById("time").innerHTML = "0" + min + " : 0" + sec;
    else if (min < 10 && sec >= 10)
      document.getElementById("time").innerHTML = "0"+min + " : " + sec;
    else
      document.getElementById("time").innerHTML = min + " : " + sec;
  }, 1000);
}



//hint
$("#hint").on("click", function(){
  for(var i = 0; i < 16; i++)
  {
    document.getElementById(i).style.pointerEvents = 'none';
    document.getElementById(i).style.backgroundColor = "white";
    document.getElementById(i).style.color = "black";
    document.getElementById(i).innerHTML = pool[i];
  }
  setTimeout(function(){
    for(var i = 0; i < 16; i++)
    {
      document.getElementById(i).style.backgroundColor = "#8B4513";
      document.getElementById(i).style.color = "white";
      document.getElementById(i).innerHTML = poolback[i];
      document.getElementById(i).style.pointerEvents = 'auto';
    }
  }, 5000);
  this.disabled = true;
  document.getElementById("hint").style.pointerEvents = 'none';
});

function reset()
{
  score = 0;
  min = 0;
  sec = 0;
  attempt = 1;
  document.getElementById("score").innerHTML = "";
  document.getElementById("time").innerHTML = "";
  document.getElementById("gameover").style.opacity = 0;
  document.getElementById("gameover").style.zIndex = -1;
  document.getElementById("gameover").innerHTML = "";
}


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
