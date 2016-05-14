var ball, player1, player2, base;

// window details
// var unit = Math.round( screen.width / 16 );
var windowWidth = 100;
var windowTop,
    windowRight,
    windowBottom,
    windowLeft;

// outerContainer coundaries
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
// Press Q to quit the game and close the ball + player windows
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
    windowY.velocity *= -1;
  }

  if(windowBottom >= outerContainer.bottom - 20 && windowY.velocity > 0){
    windowY.velocity *= -1;
  }

  if(windowRight >= outerContainer.right && windowX.velocity > 0){
    windowX.now = outerContainer.left;
  }

  if(windowLeft <= outerContainer.left && windowX.velocity < 0){
    windowX.now = outerContainer.right;
  }

  // Detection of collision with player 1;

  if(windowTop <= player2.windowBottom &&
      windowRight >= player2.windowLeft &&
      windowRight > player2.windowRight &&
      windowBottom >= player2.windowTop){
        //Weird shtuff happening
        ball.windowX.velocity *= -1;
        ball.windowY.velocity *= -1;
      }

  windowX.velocity *= 1 + Math.random() * 0.004;
  windowX.now +=  Math.round( windowX.velocity );
  windowY.velocity *= 1 + Math.random() * 0.003;
  windowY.now +=  Math.round( windowY.velocity );

  window.moveTo( windowX.now, windowY.now );
  windowTop = windowY.now;
  windowRight  = windowX.now + window.outerWidth;
  windowBottom = windowY.now + window.outerHeight;
  windowLeft   = windowX.now;
}


var movePlayerTwo = function(){
  windowX.now += ( windowX.target - windowX.now  ) / 3;
  windowX.now  = Math.round( windowX.now  );
  windowY.now += ( windowY.target - windowY.now ) / 3;
  windowY.now  = Math.round( windowY.now );

  window.moveTo( windowX.now, windowY.now );
  windowTop    = windowY.now;
  windowRight  = windowX.now + window.outerWidth;
  windowBottom = windowY.now + window.outerHeight;
  windowLeft   = windowX.now;
}

var goUp = function(){
  windowY.target -= windowWidth * 1;
}

var goDown = function(){
  windowY.target += windowWidth * 1;
}

window.onload = function(){
  var button = document.getElementById('button');
  var playerOneWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=50";
  var playerTwoWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=1250";
  var ballWindowFeatures = "menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=90,height=100";

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

    outerContainer.left = windowWidth;
    outerContainer.right = outerContainer.left + window.outerWidth;

    windowX.target = window.screenX;
    windowX.now = windowX.target;
    windowY.target = screen.height / 2 - window.outerHeight / 2;
    windowY.now = windowY.target;

  } else if(window.name === 'player2'){
    base = window.opener;
    ball = base.ball;
    player1 = base.player1;
    player2 = window;

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
