function Cart() {
  // Testing making the game fit the screen
  var totalWidth = 1216; // Tiles are 16x16 scaled up by 4 with 19 columns
  var totalHeight = 832; // 13 Rows
  var widthToHeight = 4 / 3;
  var newWidthToHeight = canvasW / canvasH;
  var ratio=0;

  if (newWidthToHeight > widthToHeight) {
    canvasW = canvasH * widthToHeight;
    ratio=canvasW / totalWidth;
  } else {
    canvasH = canvasW / widthToHeight;
    ratio=canvasH / totalHeight;
  }

  this.scale = 4*ratio;
  this.cube = 16; // width of tiles
  this.scaled = this.scale*this.cube;
  this.hero = new hero(16, 16, canvasW/2, canvasH/2, 0, types.HERO, this.scale);
  this.surTiles = [-1,1,18,19,20,-18,-19,-20];
  this.introT=0;
  this.shake=0;
  this.shakeTime=0;
  this.reset=false;
  this.wait=2;

  this.genLevel = function(num){
    if(num == 5){
      speak("BOSS LEVEL");
      this.levels = [];
      var lvl = new level(num, canvasW, canvasH, i, this.scale, true);
      lvl.reset(i, this.scaled);
      this.levels.push(lvl);
      this.level = lvl;
    } else {
      this.bkcol = ranColor();
      this.levels = []; // Array to get tiles surrounding an entity
      for(i=0;i<9;i++){
        var lvl = new level(num, canvasW, canvasH, i, this.scale);
        lvl.reset(i, this.scaled);
        this.levels.push(lvl);
      }
      this.level = this.levels[0];
      this.hero.e.currentLevel = 0;
    }
  }

  this.genLevel(0);

  // Render & Logic
  this.update = function(delta, time) {
    // Screen shake
    this.shake = shaky ? Math.cos(TIME) : 0;

    // Track Hero Door collisions
    this.door = null;

    // Controls
    if (left()){
      this.hero.e.x -= this.hero.gMove(-1,0);
      this.hero.e.flip = true;
    }
    if (right()){
      this.hero.e.x += this.hero.gMove(1,0);
      this.hero.e.flip = false;
    }
    if (up())    this.hero.e.y -= this.hero.gMove(0,-1);
    if (down())  this.hero.e.y += this.hero.gMove(0,1);
    //if (space()) this.menu.curItm=actions.GUN;

    this.hero.checkDoor();
    this.hero.setCurrentTile(this.scaled);
    this.hero.checkGun();

    // Render
    renderStarField(TIME);

    // Render back
    drawRect(ctx, 80, 120, 0, 0, 1080, 710, this.bkcol, .8);

    this.level.draw(this.hero.e, delta);

    // Draw Text
    gradient = ctx.createLinearGradient(0, 0, canvasW, 0);
    gradient.addColorStop("0", "#"+COL2);
    gradient.addColorStop(".5", "#"+COL1);
    ctx.fillStyle = gradient;
    ctx.font = "italic 40px Arial";
    ctx.fillText("AMMO " + this.hero.e.gun.ammo, 900, 50);
    if(STAGE!=5){
      ctx.fillText("LEVEL " + (STAGE+1), 600, 50);
    } else {
      ctx.fillText("BOSS FIGHT", 600, 50);
    }
    // Reset mouse click checker
    processClick = false;

    // HERO
    this.hero.update(delta);

    // MOUSE
    mg.canvas.style.cursor='none';
    let mx = mousePos.x;
    let my = mousePos.y;
    let mw = 4;
    let mh = 20;
    ctx.fillStyle='BLACK'
    ctx.globalAlpha=.4;
    w=mw*2;
    h=mh*2;
    ctx.fillRect(mx-mw,my-mh,w,h);
    ctx.fillRect(mx-mh,my-mw,h,w);

    if(this.introT > 0){
      for(i = 0;i <= canvasW/33;i++){
        for(j = 0;j <= canvasH/33;j++){
          ctx.save();
          ctx.translate(i*32, j*32);
          col = i%2==0&&j%2==0 ? "#000" : "#FFF";
          ctx.fillStyle = col;
          ctx.globalAlpha = .5;
          ctx.fillRect(this.introT/-2, this.introT/-2, this.introT, this.introT);
          ctx.restore();
        }
      }
      this.introT -= delta*48;
    }

    // Clear dead Mobs
    this.level.mobs = this.level.mobs.filter(function (m) {
      return m.entity.active == true;
    });

    // Ceck if the doors can open
    if(this.level.mobs.length == 0 && !this.level.gatesOpen){
      this.level.openDoors();
      if(this.hero.roomsDone>=0)this.hero.roomsDone++;
    }

    // Level Done Condition
    if(STAGE==5 && this.level.mobs.length==0){
      WIN=true;
      this.wait-=delta;
      if(WIN && this.wait <= 0 && !this.reset) {
        speak("You have survived the planet, a ship is on its way to rescue space kitty!");
        WIN=false;
        this.reset=true;
        this.wait=3;
      }

      if(this.wait<=0&& this.reset) GAMEOVER=true;
    }

    if(this.hero.roomsDone==9 && !l.showPortal && STAGE < 5){
      l = this.levels[this.hero.e.currentLevel];
      l.showPortal = true;
      this.hero.roomsDone = -1;
      tile = this.levels[this.hero.e.currentLevel].tiles[142];
      tile.entity.type = types.PC;
      tile.entity.setType();
      speak("Terminal Available.");
    }

    if (map()) this.renderMap();
    this.renderHP();
  }

  this.renderHP = function(){
    ctx.save();
    ctx.translate(0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#001832";
    ctx.fillRect(20, 20, 300, 40);
    ctx.fillStyle = "#a12161";
    l = this.hero.e.hp * 2.8;
    ctx.fillRect(30, 30, l, 20);
    ctx.restore();
  }

  this.renderMap = function(){
    ctx.save();
    ctx.translate(0, 0);
    ctx.globalAlpha = .8;
    ctx.fillStyle = "WHITE";
    offX = (canvasW/2) - 180;
    offY = (canvasH/2) - 180;

    this.levels.forEach((l, i) => {
      var X = (i % 3) * 120;
      var Y = Math.floor(i / 3) * 120;
      c = l.gatesOpen ? "#a12161" : "#001832";
      if(l.showPortal) c = "GOLD";
      ctx.fillStyle=c;
      ctx.fillRect(X+offX, Y+offY, 100, 100);
      if(this.level == l){
        ctx.fillStyle="BLACK";
        ctx.fillRect(X+offX+(this.hero.e.x*0.065), Y+offY+(this.hero.e.y*0.095), 20, 20);
      }
    });
    ctx.restore();
  }
}
