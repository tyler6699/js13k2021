function level(num, canvasW, canvasH, id, scale, noDoors = false) {
  STAGE=num;
  this.tiles = [];
  this.breakTiles=[];
  this.active = false;
  this.complete = false;
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

        tile = new Tile(tileSize, xx, yy, angle, type, false, c, r);
        this.tiles.push(tile);
      }
      if(r==rows-1&&c==cols){
        tin=0;
        ammo=0;
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
