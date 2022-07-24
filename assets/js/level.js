function level(num, canvasW, canvasH, id, noDoors = false) {
  STAGE=num;
  this.tiles = [];
  this.breakTiles=[];
  this.active = false;
  this.complete = false;
  this.roomNo = id;
  var tileSize = 16;
  var levelArray;

  this.draw = function(hero, delta){
    this.tiles.forEach(e => e.update(delta));
  }

  this.reset = function(id, scaled){
    this.tiles = [];
    this.dTiles = [];

    var rows = 13;
    var cols = 19;

    // Main level tiles
    var count = 0;
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {

        ts = tileSize;
        xx = c * ts;
        yy = r * ts;
        var tile;
        var type = types.AIR;
        var angle = 0;

        //if(r == 0 && c == 0) {
           type = types.BLOCK;
        //} else {
        //  type = types.WALL;
        //}

        count++;
        tile = new Tile(tileSize, xx, yy, angle, type, false, c, r);
        this.tiles.push(tile);
      }
    }

  }

  function isAir(t){
      return t == types.AIR;
  }

  this.addAir = function(t){
    this.tiles[t].entity.setT(types.AIR);
  }

  this.addWall = function(t){
    this.tiles[t].entity.setT(types.WALL);
  }

}
