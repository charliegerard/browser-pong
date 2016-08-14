// Player 2 is the one that can be controlled by the user;

var ball, player1, player2, base;
var counter1 = 0;
var counter2 = 0;

// window details
var windowWidth = 100;
var windowTop,
    windowRight,
    windowBottom,
    windowLeft;

// outerContainer boundaries
var outerContainer = {
  top: 0,
  right: screen.width,
  bottom: screen.height,
  left: 0
}

// window movement
var windowX = {
  current: 0,
  target: 0,
  velocity: 0
}

var windowY = {
  now: 0,
  target: 0,
  velocity: 0
}

// ------------------------------------------------------------
// Press Q to quit the game and close all pop-up windows
// ------------------------------------------------------------

var quit = function(){
  if(ball && !ball.closed){
    ball.close()
  }
  if(player1 && !player1.closed){
    player1.close()
  }
  if(player2 && !player2.closed){
    player2.close()
  }
}

// ------------------------
//  BALL MOVEMENTS
// ------------------------

var moveBall = function(){
  if(windowTop <= outerContainer.top + 20 && windowY.velocity < 0){
    // windowY.velocity *= -1;
    windowY.velocity = -windowY.velocity;
  }

  if(windowBottom >= outerContainer.bottom - 20 && windowY.velocity > 0){
    // windowY.velocity *= -1;
    windowY.velocity = -windowY.velocity;
  }

  if(windowRight >= outerContainer.right && windowX.velocity > 0){
    windowX.now = outerContainer.left;
  }

  if(windowLeft <= outerContainer.left && windowX.velocity < 0){
    windowX.now = outerContainer.right;
  }

  // -------------------------------------
  // Detection of collision with player 2;
  // -------------------------------------
  if(windowTop <= player2.windowBottom && windowRight >= player2.windowLeft &&
     windowRight < player2.windowRight && windowBottom >= player2.windowTop && ball.windowX.velocity > 0){

      ball.windowX.velocity = -ball.windowX.velocity;
      ball.windowY.velocity += (player2.windowX.velocity / 2);
      playSound('jump.wav');

  } else if(windowRight >= outerContainer.right && windowX.velocity > 0) { //If user loses
    var counterOneDiv = player1.document.getElementById('player-one-counter');
    base.counter1 += 1;
    counterOneDiv.innerHTML = base.counter1;

    if(base.counter1 === 2){
      playSound('sprout.wav')
    }
  }

  // -------------------------------------
  // Detection of collision with player 1; Not totally working for now
  // -------------------------------------

  if(windowTop <= player1.windowBottom && windowLeft <= player1.windowRight &&
     windowLeft < player1.windowLeft && windowBottom >= player1.windowTop && ball.windowX.velocity < 0){
        ball.windowX.velocity = -ball.windowX.velocity;
        //The following gives a new direction to the ball
        //depending on which side of the paddle it hit.
        ball.windowY.velocity += (player1.windowX.velocity / 2);
        playSound('fireball.wav');

  } else if(windowLeft <= outerContainer.left && windowX.velocity < 0 ){
    var counterTwoDiv = player2.document.getElementById('player-two-counter');
    base.counter2 += 1;
    counterTwoDiv.innerHTML = base.counter2;

    if(base.counter2 === 2){
      playSound('sprout.wav')
    }
  }

  windowX.velocity *= 1 + Math.random() * 0.003;
  windowX.now +=  Math.round( windowX.velocity );
  windowY.velocity *= 1 + Math.random() * 0.003;
  windowY.now +=  Math.round( windowY.velocity );

  window.moveTo( windowX.now, windowY.now );
  windowTop = windowY.now;
  windowRight  = windowX.now + window.outerWidth;
  windowBottom = windowY.now + window.outerHeight;
  windowLeft   = windowX.now;
}

var movePlayerOne = function(){
  var ballYPosition = base.ball.windowY.now;
  var diff = (windowY.now + (window.outerHeight / 2)) - ballYPosition;
  if(diff < 0 && diff < -200){
    windowY.target += windowWidth * 1;
  }
  if(diff > 0 && diff > 200){
    windowY.target -= windowWidth * 1;
  }

  windowX.now += (windowX.target - windowX.now) / 3;
  windowX.now = Math.round(windowX.now);
  windowY.now += (windowY.target - windowY.now) / 3;
  windowY.now = Math.round(windowY.now);

  window.moveTo(windowX.now, windowY.now);
  windowTop = windowX.now;
  windowBottom = windowY.now + window.outerHeight;
  windowRight = windowX.now + window.outerWidth;
  windowLeft = windowX.now;
}

var movePlayerTwo = function(){
  windowX.now += (windowX.target - windowX.now) / 3;
  windowX.now = Math.round( windowX.now);
  windowY.now += (windowY.target - windowY.now) / 3;
  windowY.now = Math.round(windowY.now);

  window.moveTo(windowX.now, windowY.now);
  windowTop = windowY.now;
  windowRight = windowX.now + window.outerWidth;
  windowBottom = windowY.now + window.outerHeight;
  windowLeft = windowX.now;
}

var goUp = function(){
  windowY.target -= windowWidth * 1;
}

var goDown = function(){
  windowY.target += windowWidth * 1;
}

var playSound = function(filename){
  var audio = new Audio(`./sounds/${filename}`);
  audio.play();
}

window.onload = function(){
  var button = document.getElementById('button');
  var playerOneWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=50";
  var playerTwoWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=1250";
  var ballWindowFeatures = "menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=90,height=100";

  checkDevice();

  button.onclick = function(){
    if(!player1 || player1.closed){
      player1 = window.open("./playerOneWindow.html", "player1", playerOneWindowFeatures);
    }
    if(!ball || ball.closed){
      ball = window.open("./ballWindow.html", "Ball", ballWindowFeatures);
    }
    if(!player2 || player2.closed){
      player2 = window.open('./playerTwo.html', 'player2', playerTwoWindowFeatures);
    }
  }

  if(window.name === 'Ball'){
    base  = window.opener;
    ball  = window;
    player1  = base.player1;
    player2  = base.player2;

    windowX.now = Math.round( screen.width  / 2 - window.outerWidth  / 2 );
    windowY.now = Math.round( screen.height / 2 - window.outerHeight / 2 );
    window.reset();
    window.setInterval( "moveBall()", 50 );

  } else if(window.name === 'player1'){
    base = window.opener;
    ball = base.ball;
    player1 = window;
    player2 = base.player2;
    counter1 = base.counter1;

    outerContainer.left = windowWidth;
    outerContainer.right = outerContainer.left + window.outerWidth;

    windowX.target = window.screenX;
    windowX.now = windowX.target;
    windowY.target = screen.height / 2 - window.outerHeight / 2;
    windowY.now = windowY.target;

    window.setInterval("movePlayerOne()", 50);

  } else if(window.name === 'player2'){
    base = window.opener;
    ball = base.ball;
    player1 = base.player1;
    player2 = window;
    counter2 = base.counter2;

    outerContainer.right = screen.width - windowWidth;
    outerContainer.left = outerContainer.right - window.outerWidth;

    windowX.target = window.screenX;
    windowX.now = windowX.target;
    windowY.target = screen.height / 2 - window.outerHeight / 2;
    windowY.now = windowY.target;

    window.setInterval("movePlayerTwo()", 50);
  }

  window.addEventListener('keydown', function(e){
    if(e.keyCode == 38){
      player2.goUp();
    }
    if(e.keyCode == 40){
      player2.goDown();
    }
    if(e.keyCode == 81){
      base.quit()
    }
  })
}

var reset = function(){
	if( windowX.velocity == 0 ){
		windowX.velocity = Math.round( Math.random() * 20 ) + 20;
		if( Math.round( Math.random( 0, 1 )) ) windowX.velocity *= -1;
	} else {
		var temp = windowX.velocity;
		windowX.velocity = Math.round( Math.random() * 20 ) + 20;
		if( temp < 0 ) windowX.velocity *= -1;
	};
	windowY.velocity = Math.round( Math.random() * 20 ) + 15;
	windowY.velocity = Math.abs( windowY.velocity ) * -1;
	windowY.now -= windowWidth;
};

var checkDevice = function(){
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);

    if(check === true){
      var mobileMessage = document.getElementById('mobile-message')
      mobileMessage.className += " mobile";
    }
    return check;
}
