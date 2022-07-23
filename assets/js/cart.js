function Cart() {
  this.scale = 4;
  this.cube = 16; // width of tiles
  this.scaled = this.scale*this.cube;
  this.hero = new hero(16, 16, canvasW/2, canvasH/2, 0, types.HERO, this.scale);
  this.hero.e.x = 200;
  this.hero.e.y=200;
  this.surTiles = [-1,1,18,19,20,-18,-19,-20];
  this.introT=0;
  this.shake=0;
  this.shakeTime=0;
  this.reset=false;
  this.wait=2;

  this.genLevel = function(num){
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

  this.genLevel(0);

  // Render & Logic
  this.update = function(delta, time) {
    // Screen shake
    this.shake = shaky ? Math.cos(TIME) : 0;

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

    this.hero.setCurrentTile(this.scaled);

    // Render back
    drawRect(ctx, 80, 120, 0, 0, 1080, 710, this.bkcol, .8);

    this.level.draw(this.hero.e, delta);

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
  }

}
