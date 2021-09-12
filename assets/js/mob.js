function mob(w, h, x, y, angle, type, scale, maxHP) {
  this.entity = new entity(w, h, x, y, angle, type, "", scale, false, maxHP);
  this.type=mobtype.FOLLOW;
  this.entity.gun = new Gun();
  this.entity.gun.rate=rndNo(0,3)+.5-(STAGE/10);
  if(this.entity.gun.rate<.1) this.entity.gun.rate=.2;
  
  if(type == types.TNY){
    this.bspd=150;
    this.spd = .5;
    this.entity.gun.rate=1;
  } else {
    this.bspd=800;
    this.spd=rndNo(1,3)-.5;
  }
  
  this.colArr = [];
  this.noX=false;
  this.noY=false;
  this.waitX=1;
  this.waitY=1;
  this.time=0;
  this.tryXSpeed=this.spd;
  this.tryYSpeed=this.spd;
  

  this.entity.gun.wait=rndNo(0,3)-STAGE;
  
  this.update = function(delta) {  
    this.time+=delta;
    
    if(this.time > 2){
      this.time=0
      this.noX=false;
      this.noY=false;
      this.waitY=0;
      this.waitX=0;
      this.tryXSpeed = rndNo(0,10)>5 ? this.spd : -this.spd;
      this.tryYSpeed = rndNo(0,10)>5 ? this.spd : -this.spd;
    }
    var x = this.entity.x;
    var y = this.entity.y;
      
    // Add surrounding tiles
    row = Math.floor((y - this.entity.mhHScaled) / cart.scaled);
    col = Math.floor((x - this.entity.mhWScaled) / cart.scaled);
    index = col + (19*row);
    e = this.entity;
    
    // basic follow
    ny = y < cart.hero.e.y ? y += this.move(0,this.spd) : y += this.move(0,-this.spd);
    nx = x < cart.hero.e.x ? x += this.move(this.spd,0) : x += this.move(-this.spd,0);
    
    if(this.type == mobtype.FOLLOW){
      if(this.noX && this.waitX>0){
        this.waitX-=delta;
        e.y = y += this.move(0,this.tryYSpeed);
      } else {
        e.y = ny;
      }
      if(this.noY && this.waitY>0){
        this.waitY-=delta;
        e.x = x += this.move(this.tryXSpeed,0);
      } else {
        e.x = nx;
      }
    } else if(this.type==mobtype.SIMPLE){
      e.y = ny;
      e.x = nx;
    }
    
    // Add surrounding tiles and other entities for collision checks
    this.colArr=[];
    cart.surTiles.forEach(e => this.colArr.push(cart.level.tiles[index+e].entity));
    this.colArr.push(cart.hero.e);
    cart.level.mobs.forEach(e => this.colArr.push(e.entity));
        
    e.update(delta);
    
    if(e.hp < e.maxHP){
      drawImg(ctx, e.image, 0, 32, 16, 8, e.x, e.y+(64+10), .8, e.scale);
      drawRect(ctx, e.x, e.y+(64+8),16,14,(48/e.maxHP)*e.hp,12,"#00dcf8",.8)
    }
    
    // SHOOTING
    this.entity.gun.addBullets(this.entity.x+32,this.entity.y+32,cart.hero.e.x+32,cart.hero.e.y+32,true,this.entity.type, this.bspd);
    this.entity.gun.drawBullets(delta, true);
  }
  
  this.move = function(x,y){
    rec = cloneRectanlge(this.entity.hb);
    rec.x += x;
    rec.y += y;
    canMove = true;
    amount = x+y;

    for (var t = 0; t < this.colArr.length; t++) {
      obj = this.colArr[t];
      
      if(obj != this.entity && obj.isSolid && rectColiding(obj.hb,rec)){
        canMove = false;
        amount=0;
        break;
      }
    }
    
    if(amount==0){
      if(x != 0){
        this.noX=true;
        this.waitX=.8;
      } else {
        this.noY=true;
        this.waitY=.8;
      }
    } else {
      if(x != 0 && this.waitX==0){
        this.noX=false;
      } else if(this.waitY==0) {
        this.noY=false;
      }
    }
    
    return amount;
  }
    
}