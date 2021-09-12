function hero(w, h, x, y, angle, type, scale) {
  this.e = new entity(w, h, x, y, angle, type, "", scale, false, 100);
  this.e.hp=100;
  this.e.gun = new Gun();
  this.speed=5;
  this.door=null;
  this.currentTile=null;
  this.roomsDone=0;
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
      this.e.sx=128;
      this.e.sy=0;
      if(this.e.showTextTime<=0){
        this.e.showText="Z";
        this.e.showTextTime=2;
      }
    } else {
      this.e.sx=96;
      this.e.sy=16;
    }
    this.time+=delta;
    this.e.gun.drawBullets(delta);
    this.e.update(delta);
  }  
  
  this.checkGun = function(){
    if(holdClick) holdClickT += delta;
    if(processClick || holdClickT > .25){
      this.e.idle=0;
      ox = this.e.x - this.e.mhWScaled;
      oy = this.e.y - this.e.mhHScaled;
      dx = clickedAt.x;
      dy = clickedAt.y;
      
      this.e.gun.addBullets(ox,oy,dx,dy);
    }
  }
  
  this.checkDoor = function(){
    // Check for door hit
    if(this.door != null){
      this.e.gun.bullets=[];
      cart.level = cart.levels[this.door.loadRoom];
      this.e.currentLevel=this.door.loadRoom;
      if(this.door.exitX != -1) this.e.x = this.door.exitX;
      if(this.door.exitY != -1) this.e.y = this.door.exitY;
      this.door = null;
      cart.introT = 32;
      playSound(LEVEL,5);
    }
  }
  
  this.setCurrentTile = function(scaled){
    // Set Hero Current Tile
    heroRow = Math.floor((this.e.y - this.e.mhHScaled) / scaled);
    heroCol = Math.floor((this.e.x - this.e.mhWScaled) / scaled);
    heroTileIndex = heroCol + (19*heroRow);
    if(this.currentTile != null) this.prevTile = this.currentTile;
    this.currentTile = cart.level.tiles[heroTileIndex];

    if(this.currentTile != this.prevTile){
      this.e.colArr = [];
      
      // Add surrounding tiles
      cart.surTiles.forEach(e => this.e.colArr.push(cart.level.tiles[heroTileIndex+e]));
      cart.level.mobs.forEach(e => this.e.colArr.push(e.entity));
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
        e = obj.entity;
        
        if(obj.isTile()){
          if(!stop && rectColiding(e.hb,rec)){
            if(e.isPortal() && !this.levelUp){
              canMove = false;
              this.levelUp=true;
              this.level++;
              playSound(NOISEFX,.5);
              this.roomsDone=0;
              STAGE++;
              cart.genLevel(STAGE);
              break;
            } else if(e.isHP() && !e.broke){ // HEALTH
              e.broke=true;
              e.active=false;
              hpUp = rndNo(10,40);
              this.e.hp += hpUp;
              if(this.e.hp > e.maxHP) this.e.hp = this.e.maxHP;
              this.e.showTextTime=1;
              this.e.showText="+"+hpUp+" health";
              playSound(COINFX,.5);
            } else if(e.isAmmo() && !e.broke){ // AMMO
              ad=rndNo(10,25);
              if(this.e.gun.ammo==0)speak("Try not to run out of ammo!");
              this.e.gun.ammo += ad;
              this.e.showTextTime=1;
              this.e.showText="Ammo +"+ad;
              e.sy=16;
              e.sx=64;
              e.broke = true;
              playSound(COINFX,.5);
            } else if(e.isUpgrade() && !e.broke){ // Upgrade
              ad=rndNo(10,25);
              this.e.gun.type ++;
              this.e.showTextTime=1;
              this.e.showText="UPGRADE!";
              e.sx=64;
              e.broke = true;
              playSound(LEVEL,.5);
            } else if(obj.active && e.isSolid){
              canMove = false;
              break;
            } else if(obj.isDoor && obj.doorSet()){  
              this.door = obj.door;
              stop = true;
              break;
            }
            // Hurt Hero when on Oooze and moving
            if(e.isBarrel()){
              this.e.hp-=.5;
            }
          }
        } else { // MOB
          if(!stop && obj.active && obj.isSolid && rectColiding(obj.hb, rec)){
            canMove = false;
            break;
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