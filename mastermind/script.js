var answer = [];
var ranNum;
var attempt = 1;
var pressed = [];
var Click = 0;
var img1 = document.createElement("img");
img1.src = "assets/img/correct.png";
var img2 = document.createElement("img");
img2.src = "assets/img/Warning.png";
var img3 = document.createElement("img");
img3.src = "assets/img/wrong.png";
var match = document.getElementById("match");
var wrong = 0;
var warning = 0;
var correct = 0;
var soundon = true;
var gameStarted = false;
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


document.getElementById("light").appendChild(img3);
document.getElementById("light").innerHTML += wrong;
document.getElementById("light").appendChild(img2);
document.getElementById("light").innerHTML += warning;
document.getElementById("light").appendChild(img1);
document.getElementById("light").innerHTML += correct;
for (var i = 0; i < 10; i++) {
  document.getElementsByClassName("button")[i].style.pointerEvents = 'none';
}

$("#start").on("click", function() {
  if(document.getElementById("start").innerHTML == "RETRY") {
    console.log(attempt);
    $(".button").css({"background-color":"#d9d9d9", "color":"black"});
    match.innerHTML = null;
  }
    document.getElementById("start").innerHTML = "RETRY";
    setUp();
    document.getElementById("correct").volume = 0;
    document.getElementById("correct").play();
    document.getElementById("wrong").volume = 0;
    document.getElementById("wrong").play();
});

function setUp() {
  gameStarted = true;
  if (soundon) {
    BGM.play();
  }
  correct = 0;
  warning = 0;
  wrong = 0;
  Click = 0;
  attempt = 1;
  for (var i = 0; i < 10; i++) {
    document.getElementsByClassName("button")[i].style.pointerEvents = 'auto';
  }
  for (var j = 0; j < 4; j++) {
    pressed[j] = " _ ";
  }
  createNum();
  displayInput(pressed);
  displayLight();
}

function createNum() {
  answer.splice(0, 4);
  for (var i = 0; i < 4; i++) {
    ranNum = Math.floor(Math.random() * 9);
    while (answer.indexOf(ranNum) != -1) {
      ranNum = Math.floor(Math.random() * 9);
    }
    answer.push(ranNum);
  }
  console.log(answer.join(" "));
}


function displayInput(array) {
  document.getElementById("input").innerHTML = array.join(" ");
}

$(".button").on("click", function() {
  if (pressed.indexOf(parseInt(this.id)) === -1) {
    document.getElementById("beep").currentTime = 0;
    document.getElementById("beep").play();
    pressed.splice(Click, 1, parseInt(this.id));
    displayInput(pressed);
    this.style.pointerEvents = 'none';
    this.style.backgroundColor = '#696969';
    this.style.color = '#e6e6e6';
    Click++;
    if (Click === 4) {
      for (var i = 0; i < 10; i++) {
        document.getElementsByClassName("button")[i].style.pointerEvents = 'none';
      }
      setTimeout(checkAnswer, 300);
    }
  }
});

$(window).on("keydown", function(e)
{
  if (gameStarted && Click < 4)
  {
    var keyPress = String(e.keyCode-48);
    $('#'+keyPress).click();
  }
});

function checkAnswer() {
  for (var i = 0; i < 4; i++) {
    if (pressed[i] === answer[i]) {
      correct++;
    } else if (pressed.indexOf(answer[i]) != -1) {
      warning++;
    } else {
      wrong++;
    }
  }
  displayLight();
  if (correct === 4) {
    document.getElementById("correct").volume = 1;
    document.getElementById("correct").currentTime = 0;
    document.getElementById("correct").play();
    setTimeout(gameOver, 1000);
  } else {
    document.getElementById("wrong").volume = 0.6;
    document.getElementById("wrong").currentTime = 0;
    document.getElementById("wrong").play();
    setTimeout(newAttempt, 1000);
  }
}

function displayLight() {
  $("#llight>img").remove();
  document.getElementById("light").innerHTML = null;
  document.getElementById("light").appendChild(img3);
  document.getElementById("light").innerHTML += wrong;
  document.getElementById("light").appendChild(img2);
  document.getElementById("light").innerHTML += warning;
  document.getElementById("light").appendChild(img1);
  document.getElementById("light").innerHTML += correct;
}

function newAttempt() {
  displayHistory(pressed, wrong, warning, correct);
  for (var i = 0; i < 4; i++) {
    pressed[i] = " _ ";
  }
  attempt++;
  correct = 0;
  warning = 0;
  wrong = 0;
  displayInput(pressed);
  displayLight();
  Click = 0;
  for (var j = 0; j < 10; j++) {
    document.getElementsByClassName("button")[j].style.pointerEvents = 'auto';
    document.getElementsByClassName("button")[j].style.backgroundColor = '#d9d9d9';
    document.getElementsByClassName("button")[j].style.color = 'black';
  }
}

function displayHistory(array, wr, wa, co) {
  match.innerHTML += array.join(" ");
  match.appendChild(img3);
  match.innerHTML += wr;
  match.appendChild(img2);
  match.innerHTML += wa;
  match.appendChild(img1);
  match.innerHTML += co + "<br/>";
  document.getElementById("match").scrollTop = document.getElementById("match").scrollHeight;
}

function gameOver() {
  for (var j = 0; j < 10; j++) {
    document.getElementsByClassName("button")[j].style.pointerEvents = 'none';
    document.getElementsByClassName("button")[j].style.backgroundColor = '#d9d9d9';
    document.getElementsByClassName("button")[j].style.color = 'black';
  }
  document.getElementById("light").style.fontSize = "20px";
  if (attempt == 1)
    document.getElementById("light").innerHTML = "Congratulation! You have guessed the correct combination in the first attempt!";
  else
    document.getElementById("light").innerHTML = "Congratulation! You have guessed the correct combination in " + attempt + " attempts.";
  $("#start").on("click", function() {
    document.getElementById("light").style.fontSize = "16px";
    document.getElementById("light").innerHTML = null;
    document.getElementById("light").appendChild(img3);
    document.getElementById("light").innerHTML += wrong;
    document.getElementById("light").appendChild(img2);
    document.getElementById("light").innerHTML += warning;
    document.getElementById("light").appendChild(img1);
    document.getElementById("light").innerHTML += correct;
    match.innerHTML = null;
  });
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
