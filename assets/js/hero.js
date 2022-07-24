function hero(w, h, x, y, angle, type) {
  this.e = new entity(w, h, x, y, angle, type, "", false, 100);
  this.e.hp=100;
  this.speed=5;
  this.currentTile=null;
  this.level=0;
  this.levelUp=false;
  this.levelUpTime=0;
  this.noAmmo=0;

  this.update = function(delta) {
    if(this.e.hp<= 0){
      GAMEOVER=true;
      speak("Oh no! You have failed to escape the planet.");
    }
    if(this.e.idle > 3){
      // this.e.sx=128;
      // this.e.sy=0;
      // if(this.e.showTextTime<=0){
      //   this.e.showText="Z";
      //   this.e.showTextTime=2;
      // }
    } else {
      this.e.sx=96;
      this.e.sy=16;
    }
    this.time+=delta;
    this.e.update(delta);
  }

  this.setCurrentTile = function(scaled){
    // Set Hero Current Tile
    heroRow = Math.floor((this.e.y - this.e.mhHScaled) / scaled);
    heroCol = Math.floor((this.e.x - this.e.mhWScaled) / scaled);
    heroTileIndex = heroCol + (19*heroRow); //TODO: move col count to variable so it doesnt break stuff
    if(this.currentTile != null) this.prevTile = this.currentTile;
    this.currentTile = cart.level.tiles[heroTileIndex];

    if(this.currentTile != this.prevTile){
      this.e.colArr = [];

      // Add surrounding tiles
      cart.surTiles.forEach(e => this.e.colArr.push(cart.level.tiles[heroTileIndex+e]));
    }
  }

  // check for each pixel if the hero can move, starting with full amount
  // The array contains tiles and mobs (Entities)
  this.gMove = function(xx,yy){
    this.e.idle=0;
    rec = cloneRectanlge(this.e.hb);
    rec.x += xx * this.speed;
    rec.y += yy * this.speed;
    amount = this.speed;
    stop = false;
    canMove = true;

    // Move full amount and then try decreasing
    for(var i = this.speed; i>0; i--){
      canMove = true;

      for (var t = 0; t < this.e.colArr.length; t++) {
        obj = this.e.colArr[t];
        if(obj != null){
          e = obj.entity;
          if(obj.isTile()){
            if(!stop && rectColiding(e.hb,rec)){
              if(obj.active && e.isSolid){
                canMove = false;
                break;
              }
            }
          } else { // MOB
            if(!stop && obj.active && obj.isSolid && rectColiding(obj.hb, rec)){
              canMove = false;
              break;
            }
          }
        }
      }
      if(canMove || stop){
        break;
      } else {
        amount--;
        rec.x -= xx;
        rec.y -= yy;
      }
    }

    return amount;
  }
}
