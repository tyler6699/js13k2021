function level(num, canvasW, canvasH, id, scale, noDoors = false) {
  STAGE=num;
  this.tiles = [];
  this.breakTiles=[];
  this.mvTiles = [];
  this.active = false;
  this.roomNo = id;
  var tileSize = 16;
  var levelArray;

  this.draw = function(hero, delta){
    this.dTiles.forEach(e => e.update(delta));
    this.tiles.forEach(e => e.update(delta));
  }

  this.reset = function(id, scaled){
    this.tiles = [];
    this.dTiles = [];

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
            this.dTiles.push(new Tile(tileSize, xx, yy, 0, type, false, c, r, scale));
          }
        }
      }
    }

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
        }

        tile = new Tile(tileSize, xx, yy, angle, type, false, c, r, scale);
        this.tiles.push(tile);
      }
    }
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

  this.addAir = function(t){
    this.tiles[t].entity.setT(types.AIR);
  }

  this.addWall = function(t){
    this.tiles[t].entity.setT(types.WALL);
  }

}
