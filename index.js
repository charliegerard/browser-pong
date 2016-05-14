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
var x = {
  current: 0,
  target: 0,
  velocity: 0
}

var y = {
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
  if(windowTop <= outerContainer.top + 20 && y.velocity < 0){
    y.velocity *= -1;
  }

  if(windowBottom >= outerContainer.bottom - 20 && y.velocity > 0){
    y.velocity *= -1;
  }

  if(windowRight >= outerContainer.right && x.velocity > 0){
    x.now = outerContainer.left;
  }

  if(windowLeft <= outerContainer.left && x.velocity < 0){
    x.now = outerContainer.right;
  }

  // Detection of collision with player 1;

  if(windowTop <= player2.windowBottom &&
      windowRight >= player2.windowLeft &&
      windowRight > player2.windowRight &&
      windowBottom >= player2.windowTop){
        //Weird shit happening
        ball.x.velocity *= -1;
        ball.y.velocity *= -1;
      }

  x.velocity *= 1 + Math.random() * 0.004;
  x.now +=  Math.round( x.velocity );
  y.velocity *= 1 + Math.random() * 0.003;
  y.now +=  Math.round( y.velocity );

  window.moveTo( x.now, y.now );
  windowTop = y.now;
  windowRight  = x.now + window.outerWidth;
  windowBottom = y.now + window.outerHeight;
  windowLeft   = x.now;
}


var movePlayerTwo = function(){
  x.now += ( x.target - x.now  ) / 3;
  x.now  = Math.round( x.now  );
  y.now += ( y.target - y.now ) / 3;
  y.now  = Math.round( y.now );

  window.moveTo( x.now, y.now );
  windowTop    = y.now;
  windowRight  = x.now + window.outerWidth;
  windowBottom = y.now + window.outerHeight;
  windowLeft   = x.now;
}

var go_up = function(){
  y.target -= windowWidth * 1;
}

var go_down = function(){
  y.target += windowWidth * 1;
}

window.onload = function(){
  var button = document.getElementById('button');
  var playerOneWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=50";
  var playerTwoWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes,width=90,height=200,screenX=1250";
  var ballWindowFeatures = "menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=90,height=100,screenX=50";

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

    x.now = Math.round( screen.width  / 2 - window.outerWidth  / 2 );
    y.now = Math.round( screen.height / 2 - window.outerHeight / 2 );
    window.reset();
    window.setInterval( "moveBall()", 50 );

  } else if(window.name === 'player1'){
    base = window.opener;
    ball = base.ball;
    player1 = window;
    player2 = base.player2;

    outerContainer.left = windowWidth;
    outerContainer.right = outerContainer.left + window.outerWidth;

    x.target = window.screenX;
    x.now = x.target;
    y.target = screen.height / 2 - window.outerHeight / 2;
    y.now = y.target;

  } else if(window.name === 'player2'){
    base = window.opener;
    ball = base.ball;
    player1 = base.player1;
    player2 = window;

    outerContainer.right = screen.width - windowWidth;
    outerContainer.left = outerContainer.right - window.outerWidth;

    x.target = window.screenX;
    x.now = x.target;
    y.target = screen.height / 2 - window.outerHeight / 2;
    y.now = y.target;

    window.setInterval("movePlayerTwo()", 50);
  }

  window.addEventListener('keydown', function(e){
    if(e.keyCode == 38){
      player2.go_up();
    }
    if(e.keyCode == 40){
      player2.go_down();
    }
    if(e.keyCode == 81){
      base.quit()
    }
  })
}

var reset = function(){
	if( x.velocity == 0 ){
		x.velocity = Math.round( Math.random() * 20 ) + 20;
		if( Math.round( Math.random( 0, 1 )) ) x.velocity *= -1;
	} else {
		var temp = x.velocity;
		x.velocity = Math.round( Math.random() * 20 ) + 20;
		if( temp < 0 ) x.velocity *= -1;
	};
	y.velocity = Math.round( Math.random() * 20 ) + 15;
	y.velocity = Math.abs( y.velocity ) * -1;
	y.now -= windowWidth;
};
