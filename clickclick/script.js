//game variables
var ranNum;
var score = 0;
var time = 60;
var interval = 1000;
var gamerun = false;
var timer, timer2, speedInc;
var dot = 1;
var soundon = true;
var BGM = document.getElementById("bgm");
BGM.volume = 0.3;

$('img').on('dragstart', function(event) { event.preventDefault(); });

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);


//start button
for (var i = 0; i < 25; i++)
{
  document.getElementById(i).style.pointerEvents = 'none';
  document.getElementById(i).style.opacity = 0.4;
}
$("#start").on("click", function(){
  if(soundon) {
    BGM.play();
  }
  startTimer(3);
  setTimeout(function(){
    game();
  }, 3000);
  this.disabled = true;
  document.getElementById("clickbeep").volume=0;
  document.getElementById("clickbeep").play();
  document.getElementById("clickbeep").pause();
  document.getElementById("clickbeep").volume=1;
});

//game run
function game()
{
  gamerun = true;
  displayScore();
  countDown(time);
  speedIncrease();
  buzzer();
}

function endgame()
{
  document.getElementById("endbeep").play();
  document.getElementById("start").innerHTML = "RETRY";
  document.getElementById("start").disabled = false;
  $("#start").on("click", function()
  {
    document.getElementById("score").innerHTML = "";
    restart();
  });
}

function restart() {
  document.getElementById("start").innerHTML = "START";
  document.getElementById("start").disabled = true;
  clearInterval(speedInc);
  score = 0;
  interval = 1000;
  dot= 1;
}

function random()
{
   return (Math.floor(Math.random() * 24));
}

function buzzer()
{
  if (gamerun)
  {
      ranNum = random();
      document.getElementById(ranNum).src = "assets/img/button_on.png";
      document.getElementById(ranNum).style.pointerEvents = 'auto';
      document.getElementById(ranNum).style.opacity = 1;
      // document.getElementById("beep").play();
      setTimeout(function(){
        document.getElementById(ranNum).src = "assets/img/button_off.png";
        document.getElementById(ranNum).style.opacity = 0.4;
        document.getElementById(ranNum).style.pointerEvents = 'none';
      }, interval);
    if (dot >= 2)
    {
      ranNum2 = random();
      document.getElementById(ranNum2).src = "assets/img/button_on.png";
      document.getElementById(ranNum2).style.pointerEvents = 'auto';
      document.getElementById(ranNum2).style.cursor = 'pointer';
      document.getElementById(ranNum2).style.opacity = 1;
      setTimeout(function(){
        document.getElementById(ranNum2).src = "assets/img/button_off.png";
        document.getElementById(ranNum2).style.opacity = 0.4;
        document.getElementById(ranNum2).style.pointerEvents = 'none';
        }, interval);
    }
    if (dot >= 3)
    {
      ranNum3 = random();
      document.getElementById(ranNum3).src = "assets/img/button_on.png";
      document.getElementById(ranNum3).style.pointerEvents = 'auto';
      document.getElementById(ranNum3).style.cursor = 'pointer';
      document.getElementById(ranNum3).style.opacity = 1;
      setTimeout(function(){
        document.getElementById(ranNum3).src = "assets/img/button_off.png";
        document.getElementById(ranNum3).style.opacity = 0.4;
        document.getElementById(ranNum3).style.pointerEvents = 'none';
        }, interval);
    }
    if (dot >= 4)
    {
      ranNum4 = random();
      document.getElementById(ranNum4).src = "assets/img/button_on.png";
      document.getElementById(ranNum4).style.pointerEvents = 'auto';
      document.getElementById(ranNum4).style.cursor = 'pointer';
      document.getElementById(ranNum4).style.opacity = 1;
      setTimeout(function(){
        document.getElementById(ranNum4).src = "assets/img/button_off.png";
        document.getElementById(ranNum4).style.opacity = 0.4;
        document.getElementById(ranNum4).style.pointerEvents = 'none';
        }, interval);
    }
    setTimeout(function(){
      buzzer();
    }, interval);
  }
}

function speedIncrease()
{
    speedInc = setInterval(function(){
    interval-=3;
  }, 1000);
}

function dotIncrease()
{
  if (score >= 10 && score < 25)
    dot = 2;
  if (score >= 25 && score < 40)
    dot = 3;
  if (score >= 40)
    dot = 4;
}
$(".buzzer").on("mousedown", function()
{
  document.getElementById("clickbeep").currentTime = 0;
  document.getElementById("clickbeep").play();
  this.src = "assets/img/button_off.png";
  this.style.opacity = 0.4;
  this.style.pointerEvents = 'none';
  score++;
  displayScore();
});
$(".buzzer").on("touchstart", function()
{
  document.getElementById("clickbeep").currentTime = 0;
  document.getElementById("clickbeep").play();
  this.src = "assets/img/button_off.png";
  this.style.opacity = 0.4;
  this.style.pointerEvents = 'none';
  score++;
  displayScore();
});

function displayScore()
{
  document.getElementById("score").innerHTML = score;
  dotIncrease();
}
//timer
function countDown(sec)
{
  var mins = Math.floor(sec/60);
  var secs = sec%60;
    if (sec >= 0)
    {
      if (secs < 10)
      {
        document.getElementById("time").innerHTML = mins+ " : 0" +secs;
      }
      else
      {
        document.getElementById("time").innerHTML = mins+ " : " +secs;
      }
      sec--;
      timer = setTimeout('countDown('+sec+')', 1000);
    }
    else
    {
      window.clearTimeout(timer);
      gamerun = false;
      endgame();
    }
}


function startTimer(sec)
{
  if (sec > 0)
  {
    document.getElementById("timerbeep").volume = 0.2;
    document.getElementById("timerbeep").play();
    document.getElementById("timerbeep").currentTime = 0;
    document.getElementById("time").innerHTML = sec--;
    timer2 = setTimeout('startTimer('+sec+')', 1000);
  }
  else
  {
    window.clearTimeout(timer2);
  }
}

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
    if (BGM.paused && gamerun) {
      BGM.play();
    }
  }
});
