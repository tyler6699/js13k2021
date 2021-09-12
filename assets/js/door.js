function door(room,x,y) {
  this.active = true;
  this.open = false;
  this.loadRoom = room;
  this.exitX=x;
  this.exitY=y;
}