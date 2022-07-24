function Gun(){
  this.ammo=AMMOSTART;
  this.bullets=[];
  this.rate=.1;
  this.wait=0;
  this.type=guntype.ONESHOT;
  this.angles = [0];
  this.r=0.0174533;

  this.addBullets = function(ox,oy,dx,dy, friendly=false, mt=null, spd=null){
    // Remove old drawBullets
    if(this.ammo>0 && this.wait<=0){
      this.wait=this.rate;

      // Snap mouse cursor to this radius
      // https://i.stack.imgur.com/7Rmf4.gif
      var radius = 60;

      // Angle of mouse and hero centre
      var angle = Math.atan2(dy - oy, dx - ox);

      if(this.type == guntype.ONESHOT){
        this.angles = [0];
      } else if(this.type==guntype.TWOSHOT){
        this.angles = [-5,5];
      } else if(this.type==guntype.THREESHOT){
        this.angles = [0,15,-15];
      } else if(this.type==guntype.MULTISHOT){
        this.angles = [0,-20,-40,-60,20,40,60];
      }

      if(mt==types.TNY) this.angles = [0,90,-90,180];

      this.angles.forEach((a, i) => {
        xx = ox + radius * Math.cos(angle+(a*this.r));
        yy = oy + radius * Math.sin(angle+(a*this.r));
        this.bullets.push(new Bullet(ox,oy,xx,yy, spd));
      });

      if(!friendly){
        cart.shakeTime=.2;
        playSound(SHOOT,.5);
        this.ammo--;
        if(this.ammo==0){
          this.noAmmo++;
          speak("Out of ammo.");
        }
      }

    }
  }

  this.drawBullets = function(delta, friendly=false){
    if(this.wait>0){
      this.wait-=delta;
    }

    this.bullets.forEach(e => e.draw(delta, friendly));

    // Remove bullets
    this.bullets = this.bullets.filter(function (b) {
      return b.active == true;
    });
  }
}

function Bullet(ox,oy,dx,dy, spd = null){
  this.speed = spd != null ? spd : BSPEED;
  this.w = 50;
  this.h = 20;
  this.mhWidth = this.w / -2;
  this.mhHeight = this.h / -2;
  this.dst=0;
  this.active=true;
  this.hb = new rectanlge(ox, oy, this.w, this.h);
  this.colour= spd != null ? ranColor() : "#a12161";
  this.dist=0;
  // 0 is perfect
  // .5 is awful
  this.accuracy=.1;

  // Vector
  this.v = new vec2(ox+10, oy+10);

  // atan2: convert vector to angle, sin/cos to convert back to vector.
  dir = Math.atan2(oy-dy,ox-dx) + (Math.PI) + (Math.random() - 0.5) * 2 * this.accuracy;
  this.dx = Math.cos(dir);
  this.dy = Math.sin(dir);
  this.angle = Math.atan2(oy - dy, ox - dx);

  this.checkHits = function(e, friendly=false){
    if(rectColiding(e.hb,this.hb) && e.hp>=0){
      e.hp--;
      this.active=false;

      if(e.hp < 0){
        // Spawn HP
        if(rndNo(0,100)>90){
          r = Math.floor((e.y - e.mhHScaled) / 64);
          c = Math.floor((e.x - e.mhWScaled) / 64);
          tile = cart.level.tiles[c + (19*r)];
          tile.entity.type = types.HP;
          tile.entity.setType();
        }
        playSound(DIEFX,.5);
        if(e.isBarrel()){
          e.sx=0;
          e.sy=48;
        } else if(e.isTree()){
            e.sy=48;
        } else {
          e.active = false;
        }
        e.isSolid = false;
      }
    }
  }

  this.draw = function(delta, friendly = false){
    // Update Position
    if(this.active){
      // Previous position
      xx = this.v.x;
      yy = this.v.y;
      // New Position
      this.v.x +=(this.dx*delta)*this.speed;
      this.v.y +=(this.dy*delta)*this.speed;
      // Distance Travelled
      this.dist +=  Math.sqrt( ((this.v.x-xx)*(this.v.x-xx)) + ((this.v.y-yy)*(this.v.y-yy)) );

      if(this.v.x < 0 || this.v.x>1300 || this.v.y < 0 || this.v.y > 840 || this.dist > SHOOTDIST){
        this.active = false;
      }
      this.hb.x = this.v.x + this.mhWidth;
      this.hb.y = this.v.y + this.mhHeight;

      //Collision Test
      if(!friendly)cart.level.mobs.forEach(e => this.checkHits(e.entity));
      if(friendly) this.checkHits(cart.hero.e);
      cart.level.breakTiles.forEach(e => this.checkHits(e.entity));

      // Draw
      ctx.save();
      ctx.translate(this.v.x, this.v.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = .5;
      ctx.fillStyle = "white";
      ctx.fillRect((this.mhWidth+.5 *.5), (this.mhHeight+.5 * .5), (this.w+.5 * .5), (this.h+.5 * .5));
      ctx.globalAlpha = .8;
      ctx.fillStyle = this.colour;
      ctx.fillRect((this.mhWidth *.5), (this.mhHeight * .5), (this.w * .5), (this.h * .5));
      ctx.restore();
    }
  }
}
