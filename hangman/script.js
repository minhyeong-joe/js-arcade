var pool = ["refrigerator", "newsletter", "restaurant", "electronic", "laptop", "computer", "notebook", "mouse", "cookie", "microwave", "dishwasher", "stove", "bookshelf", "attorney", "bed", "cat", "dog", "giraffe", "elephant", "aligator", "picture", "helicopter", "army", "blue", "green", "red", "hamburger", "holiday", "holloween", "christmas", "thanksgiving", "year", "month", "eyebrows", "hair", "desktop", "bleach", "lotion", "soup", "bathtub", "kitchen", "bathroom", "bedroom", "livingroom", "faucet", "toothpaste", "table", "charger", "cable", "switch", "answer", "attempt", "hangman", "typewriter"];

var attempts;
var ranNum;
var answer,
  answerLower;
var underScore;
var correctltr;
var keyInput = [];
var soundon = true;
var gameStarted = false;
var BGM = document.getElementById("bgm");
BGM.volume = 0.3;

var lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

$('.start').on('click', function() {
  setUp();
  $('#letterbank>button').css({"pointerEvents": "auto"});
  var buttons = document.getElementsByClassName("letters");
  for (var i=0; i< 26; i++) {
    buttons[i].disabled = false;
  }
  $('.start').css({"display": "none"});
  $('#answer').css({"display": "block"});
  gameStarted = true;
  if (soundon) {
    BGM.play();
  }
});

function setUp() {
  attempts = 8;
  ranNum = Math.floor(Math.random() * pool.length);
  answer = pool[ranNum];
  answerLower = (answer.toLowerCase()).split("");
  underScore = [];
  correctltr = [];
  gameStart();
};

function gameStart() {
  document.getElementById("attempts").innerHTML = "You have " + attempts + " attempts left.";
  for (var i = 0; i < answerLower.length; i++) {
    if (answerLower[i] == " ") {
      underScore[i] = '&nbsp';
      correctltr.push(" ");
    } else
      underScore[i] = '_';
    }
  document.getElementById("answer").innerHTML = underScore.join(" ");
  drawing();
}

$(".letters").on("click", function() {
  btnClick(this.id);
  this.disabled = true;
  this.style.backgroundColor = "#444";
  this.style.pointerEvents = 'none';
});

$(window).on("keydown", function(e) {
  if (e.keyCode >= 65 && e.keyCode <= 90 && !keyInput[e.keyCode] && attempts > 0) {
    var char = String.fromCharCode(e.keyCode + 32);
    btnClick(char);
    document.getElementById(char).disabled = true;
    document.getElementById(char).style.backgroundColor = "#444";
    document.getElementById(char).style.pointerEvents = 'none';
    keyInput[e.keyCode] = true;
  }
});

function btnClick(ltr) {
  var gotIt = false;
  for (var i = 0; i < answerLower.length; i++) {
    if (ltr === answerLower[i]) {
      document.getElementById("beep").currentTime = 0;
      document.getElementById("beep").play();
      underScore[i] = ltr;
      correctltr.push(ltr);
      gotIt = true;
    }
  }
  if (!gotIt) {
    document.getElementById("wrongbeep").volume = 0.3;
    document.getElementById("wrongbeep").currentTime = 0;
    document.getElementById("wrongbeep").play();
    attempts--;
  }
  if (attempts === 1) {
    document.getElementById("attempts").innerHTML = "You have " + attempts + " attempt left.";
    document.getElementById("attempts").style.color = "red";
    document.getElementById("attempts").style.fontSize = "2.2rem";
    document.getElementById("attempts").style.fontWeight = "bold";
  } else if (attempts < 1)
    document.getElementById("attempts").innerHTML = "You are dead!";
  else
    document.getElementById("attempts").innerHTML = "You have " + attempts + " attempts left.";
  document.getElementById("answer").innerHTML = underScore.join(" ");
  drawing();
  objective();
}

function drawing() {
  if (attempts === 8) {
    document.getElementById("hangmanpic").src = "assets/img/try0.png";
  } else if (attempts === 7)
    document.getElementById("hangmanpic").src = "assets/img/try1.png";
  else if (attempts === 6)
    document.getElementById("hangmanpic").src = "assets/img/try2.png";
  else if (attempts === 5)
    document.getElementById("hangmanpic").src = "assets/img/try3.png";
  else if (attempts === 4)
    document.getElementById("hangmanpic").src = "assets/img/try4.png";
  else if (attempts === 3)
    document.getElementById("hangmanpic").src = "assets/img/try5.png";
  else if (attempts === 2)
    document.getElementById("hangmanpic").src = "assets/img/try6.png";
  else if (attempts === 1)
    document.getElementById("hangmanpic").src = "assets/img/try7.png";
  else if (attempts === 0)
    document.getElementById("hangmanpic").src = "assets/img/try8.png";
  }

function objective() {
  if (correctltr.length === answerLower.length) {
    for (var i = 0; i < 26; i++) {
      document.getElementsByClassName("letters")[i].style.pointerEvents = 'none';
    }
    setTimeout(function() {
      document.getElementById("correctbeep").currentTime=0;
      document.getElementById("correctbeep").play();
      document.getElementById("answer").innerHTML = "Congratulation! The correct answer is <font color='blue'>" + answerLower.join("") + "</font>.";
      document.getElementById("retry").style.display = "block";
      $("#retry").on("click", function() {
        reset();
      });
    }, 200);
  } else if (attempts === 0) {
    for (var j = 0; j < 26; j++) {
      document.getElementsByClassName("letters")[j].style.pointerEvents = 'none';
    }
    setTimeout(function() {
      document.getElementById("answer").innerHTML = "You died! The correct answer is <font color='blue' size='30px'>" + answerLower.join("") + "</font>.";
      document.getElementById("retry").style.display = "block";
      $("#retry").on("click", function() {
        reset();
      });
    }, 200);
  }
}

function reset() {
  for (var j = 65; j <= 90; j++) {
    keyInput[j] = false;
  }
  document.getElementById("attempts").style.color = "white";
  document.getElementById("attempts").style.fontSize = "";
  document.getElementById("attempts").style.fontWeight = "";
  document.getElementById("retry").style.display = 'none';
  for (var i = 0; i < 26; i++) {
    document.getElementsByClassName("letters")[i].disabled = false;
    document.getElementsByClassName("letters")[i].style.backgroundColor = '';
    document.getElementsByClassName("letters")[i].style.pointerEvents = 'auto';
  }
  setUp();
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
