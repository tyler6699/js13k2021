function level(num, canvasW, canvasH, id, scale, noDoors = false) {
  STAGE=num;
  this.tiles = [];
  this.breakTiles=[];
  this.mvTiles = [];
  this.mobs = [];
  this.active = false;
  this.complete = false;
  this.roomNo = id;
  this.gatesOpen = false;
  this.showPortal=false;
  var tileSize = 16;
  var levelArray;
  
  this.draw = function(hero, delta){
    this.dTiles.forEach(e => e.update(delta));
    this.tiles.forEach(e => e.update(delta));
    this.mobs.forEach(e => e.update(delta));
    
    // Door Animations
    this.mvTiles.forEach((t, i) => {
      if(t.entity.mvY != 0 && t.entity.mvY > 0){
        t.entity.y++;
        t.entity.mvY--;
      }
      // Door open fully
      if(t.entity.mvY == 0){
        t.entity.alpha = .5;
        t.entity.isSolid = false;
        t.entity.renT2 = true;
      }
    });
    
    this.mvTiles = this.mvTiles.filter(function (t) {
      return t.entity.mvY != 0;
    });  
      
    this.breakTiles = this.tiles.filter(function (t) {
      return t.entity.breaks == true;
    }); 
  }
  
  this.reset = function(id, scaled){
    boss = STAGE==5;
    this.tiles = [];
    this.dTiles = [];
    this.mobs = [];
    this.showPortal=false;
    
    var rows = 13;
    var cols = 19;
    
    // Decor and back tiles
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        xx = c * scaled;
        yy = r * scaled;
        
        if(r > 1 && r < 12 && c > 0 && c < 18) {
          var type = null;
          
          // GRID Background Patterns
          // GRID_1:4, GRID_2:5, GRID_3:6, GRID_4:7,
          if(rndNo(0,100) > 80){
            type = 4;
          } else if(rndNo(0,100) > 70){
            type = 5;
          } else if(rndNo(0,100) > 70){
            type = 6;
          } else if(rndNo(0,100) > 70){
            type = 7;
          }
          
          if(type != null){
            this.dTiles.push(new Tile(tileSize, xx, yy, 0, type, false, c, r));
          }
        }  
      }
    }
    
    // Count ammo crates added
    ammo=0;
    tin=0;
    upgrade = rndNo(0,100) > (95-STAGE);
    // Main level tiles
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        
        ts = tileSize * scale;
        xx = c * ts;
        yy = r * ts;
        var tile;
        var type = types.WALL;
        var angle = 0;

        // Create a room
        if(r == 2 && (c > 1 && c < 17)){
          type = types.WALL;
        } else if (r == 12 && (c > 0 && c < 18)){
          type = types.WALL;
        } else if(r == 0 || c == 0 || r == 12 || c == 18){
          type = types.AIR;
        } else if (isEdge(r,c)){
          type = types.BLOCK;
        } else {
          type = types.AIR
          
          // ROCK DECOR
          if(rndNo(0,100) > 90 && r > 2){
            // ROCK_1:9 ROCK_2:10 ROCK_3:12 ROCK_4:13
            type = [9,10,12,13][rndNo(0,3)];
          }
        }
      
        if(inBounds(r,c) && !boss){
          if(!noDoors){
            if(rndNo(0,100) > 98 && isAir(type) && tin < 5){
                type = types.BARREL;
                tin++;
            }
            if(upgrade && rndNo(0,100)> 70 && isAir(type)){
              type=types.UPGRADE;
              upgrade = false;
            }
            if(rndNo(0,100) > 98 && isAir(type)) type = types.TREE;
            if(rndNo(0,100) > 99 && isAir(type)) type = types.CUBE;
            if(rndNo(0,1000) > 985 && isAir(type) && ammo < 3){
                type = types.AMMO;
                ammo++;
            }
          }  
        }
      
        tile = new Tile(tileSize, xx, yy, angle, type, false, c, r);
        this.tiles.push(tile);
      }
      if(r==rows-1&&c==cols){
        tin=0;
        ammo=0;
      }
    }
    
    if(boss){
      for (m = 0; m < 35; m++) {
          mb = new mob(9, 10, rndNo(124,1028), rndNo(124,644), 0, types.TNY, scale, 5);
          mb.type = mobtype.SIMPLE;
          this.mobs.push(mb);
      }
      // mb = new mob(16, 16, rndNo(124,1028), rndNo(124,644), 0, types.BOT, scale, rndNo(1,3+STAGE));
    } else {
      if(!noDoors){
        // DOORS
        switch(id) {
          case 0:
            this.doorR();
            this.doorB();
            break;
          case 1:
            this.doorR();
            this.doorL();
            this.doorB();
            break;
          case 2:
            this.doorL();
            this.doorB();
            break;
          case 3:
            this.doorR();
            this.doorB();
            this.doorT();
            break;
          case 4:
            this.doorR();
            this.doorL();
            this.doorT();
            this.doorB();
            break;
          case 5:
            this.doorL();
            this.doorT();
            this.doorB();
            break;
          case 6:
            this.doorR();
            this.doorT();
            break;
          case 7:
            this.doorR();
            this.doorL();
            this.doorT();
            break;
          case 8:
            this.doorT();
            this.doorL();
            break;
        }
      
        // MOBS
        noMobs = rndNo(1,3)+STAGE;
        // console.log("Level: " + id + " Mobs: " + noMobs);
        for (m = 0; m < noMobs*2; m++) {
          if(m >= noMobs){
            mb = new mob(9, 10, rndNo(124,1028), rndNo(124,644), 0, types.TNY, scale, 0);
            mb.type = mobtype.SIMPLE;
          } else {
            mb = new mob(16, 16, rndNo(124,1028), rndNo(124,644), 0, types.BOT, scale, rndNo(1,3+STAGE));
          }
          this.mobs.push(mb);
        }
      }
    } // BOX CHECK
  }
  
  function isAir(t){
      return t == types.AIR;
  }
  
  function isEdge(r,c){
    return (c == 1) || (c == 17) || (r==1 && c == 1) || (r==1 && c == 17) || (r==1 && c > 1 && c < 17) || 
           (r==11 && c == 17) || (r==11 && c == 1) || (r==11 && c > 1 && c < 17);
  }
              
  function inBounds(r,c){
    return r > 2 && r<11 && c>1 && c<17;
  }
  
  this.openDoors = function(){
    // Put walls in place
    this.gatesOpen = true;
    
    this.tiles.forEach((t, i) => {
      if(t.entity.isDoorWall()){
        t.entity.setT(types.AIR);
      } else if(t.entity.isDoorTop()){
        t.entity.mvY = 48;
        this.mvTiles.push(t);
      }
      if(t.door != null) t.door.open = true;
    });
  }
  
  this.doorR = function(){
    [113,132,151].forEach(e => this.addDoor(e,id+1,130,-1,types.AIR,true));
    [112,131,150].forEach(e => this.addDoor(e,0,0,0,types.DOOR_BLOCK,false));
  }
  
  this.doorL = function(){
    [95,114,133].forEach(e => this.addDoor(e,id-1,1024,-1,types.AIR,true));
    [96,115,134].forEach(e => this.addDoor(e,0,0,0,types.DOOR_BLOCK,false));
  }
  
  this.doorB = function(){
    [236,237,238].forEach(e => this.addDoor(e,id+3,-1,160,types.DOOR_WALL,true));
    [217,218,219].forEach(e => this.addDoor(e,0,0,0,types.DOOR_BLOCK,false));
  }
  
  this.doorT = function(){
    [27,28,29].forEach(e => this.addDoor(e,id-3,-1,640,types.DOOR_BLOCK,true));
    [46,47,48].forEach(e => this.addDoor(e,0,0,0,types.DOOR_WALL,false));
  }
    
  this.addDoor = function(t,room,x,y,type,d=false){
    tile = this.tiles[t];
    tile.entity.setT(type);
    if(d)tile.door = new door(room,x,y);
    // Draw a wall when doors opening or opened
    if([112,96].includes(t)) tile.entity.type2 = types.DOOR_WALL; 
    if([217,218,219,27,28,29].includes(t)) tile.entity.type3 = types.DOOR_WALL;
  }
  
  this.addAir = function(t){
    this.tiles[t].entity.setT(types.AIR);
  }
  
  this.addWall = function(t){
    this.tiles[t].entity.setT(types.WALL);
  }

}
