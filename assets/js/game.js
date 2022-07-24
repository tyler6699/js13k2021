// ╔═══════════════════════════════╗
// ║ JS13K Entry by @CarelessLabs  ║
// ╚═══════════════════════════════╝

// IDEAS

// Nuclear Melt down simulator
// Run around doing tasks to stop a melt DOWN
// Make decisions on number of deaths
// Mini games to fix things
// Control panel of lights and switches
var vs=4;
var mg;
var canvasW;
var canvasH;
var border=10;
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var aspectRatio;
var gameStarted = true;
var delta = 0.0;
var prevDelta = Date.now();
var currentDelta = Date.now();
var TIME = 0;
var introT = 0;
var mousePos = new vec2(0,0);
var clickedAt = new vec2(0,0);
var clickRow;
var clickCol;
var processClick = false;
var holdClick = false;
var holdClickT = 0;
var GAMEOVER=false;
var COL1 = "990099";
var COL2 = "05f2db";
var BSPEED=1000;
var WIN = false;
var AMMOSTART=101;
var SHOOTDIST = 600;
var STAGE=1;
var atlas = new Image();
atlas.src = "atlas.png";
var shaky = true;
var cart = new Cart();
var v = speechSynthesis.getVoices();
var talk = true;

// Audio
var start=false;

// Called by body onload on index page
function startGame() {
  mg.start();
}

var mg = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.context = this.canvas.getContext("2d");
    ctx=this.context;
    resizeCanvas();
    this.canvas.classList.add("screen");
    document.body.insertBefore(this.canvas, document.body.childNodes[6]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);

    // Keyboard
    window.addEventListener('keydown', function(e) {
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      mg.keys[e.keyCode] = (e.type == "keydown");
      if(e.keyCode==ONE) shaky = !shaky;
      if(e.keyCode==TWO) cart.bkcol = ranColor();
      if(e.keyCode==R) GAMEOVER=true;
    })
    // Mouse Buttons
    window.addEventListener('mousedown', function(e) {
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.button] = true;
      holdClick = true;
    })
    window.addEventListener('mouseup', function(e) {
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.button] = false;
      holdClick = false;
      holdClickT = 0;
      processClick = true;
      if(!start && TIME>2000) start=true;
      setclicks();
    })
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(e) {
      e.preventDefault();
      var r = mg.canvas.getBoundingClientRect();
      mousePos.set((e.clientX - r.left) / (r.right - r.left) * canvasW,
                   (e.clientY - r.top) / (r.bottom - r.top) * canvasH);
      row = Math.floor(mousePos.y / this.scaled);
      col = Math.floor(mousePos.x / this.scaled);

      setclicks();
    })
    // Disable right click context menu
    this.canvas.oncontextmenu = function(e) {
      e.preventDefault();
    };
  },
  stop: function() {
    clearInterval(this.interval);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function setclicks(){
  clickedAt.set(mousePos.x, mousePos.y);
}

function updateGameArea() {
  if(GAMEOVER){
    TIME=0;
    var h = cart.hero;
    h.e.hp=100;
    h.roomsDone = 0;
    h.levelUpTime=0;
    h.levelUp=false;
    GAMEOVER=false;
    WIN=false;
    STAGE=0;
    start=false;
    gameStarted=false;
    cart.genLevel(STAGE);
  }

  if(start && TIME>2000){
    if(cart.hero != null)cart.hero.e.active=true;
    gameStarted=true;
    if(audioCtx == null) audioCtx = new AudioContext();
  }

  // Delta
  prevDelta = currentDelta;
  currentDelta = Date.now();
  delta = currentDelta - prevDelta;
  TIME += delta;

  if (!gameStarted) {
    // intro Screen
    mg.clear();
    ctx = mg.context;
    ctx.save();
    var b = 100* aspectRatio;
    drawBox(ctx,0.5,"#"+COL1,0,0,100,200);
    txt = "[ CLICK TO START ]";
    writeTxt(ctx, 1, "italic 50px Arial","WHITE",txt, 100, 100);

    // z=TIME/1600;
    // writeTxt(ctx, 1, "italic 90px Arial","WHITE","SPACE KITTY", 300+Math.cos(z)*40, 150+Math.sin(z)*20);
    // writeTxt(ctx, 1, "italic 60px Arial","WHITE","was not the imposter!", 300+Math.cos(z)*70, 200+Math.sin(z)*20);

    renderStarField(TIME);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    t = TIME/1e3;
    x = (1232/2)-128+Math.cos(t)*40;
    y = (846/2)-128+Math.sin(t)*20;
    drawImage(ctx, cart.hero.e.image, 96, 16, 16, 13, x-80, y+40, 256, 208, 1);
    drawImage(ctx, cart.hero.e.image, 32, 48, 16, 16, x, y, 256, 256, 1);
  } else {
    mg.clear();
    cart.update(delta / 1e3, TIME);
  }
}

function left() {
  return mg.keys && (mg.keys[LEFT] || mg.keys[A]);
}

function right() {
  return mg.keys && (mg.keys[RIGHT] || mg.keys[D]);
}

function up() {
  return mg.keys && (mg.keys[UP] || mg.keys[W]);
}

function down() {
  return mg.keys && (mg.keys[DOWN] || mg.keys[S]);
}

function space() {
  return mg.keys && mg.keys[SPACE];
}

function map() {
  return mg.keys && mg.keys[M];
}
