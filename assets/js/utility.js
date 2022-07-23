// Useful Functions and classes
// function setHeroText(text){
//   cart.hero.showTextY=-15;
//   cart.hero.showTextTime=TEXTTIME/2;
//   cart.hero.showText=text;
// }

function rectanlge(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function ranColor() {
  var l = '0123456789ABCDEF';
  var c = '#';
  for (var i = 0; i < 6; i++) {
    c += l[Math.floor(Math.random() * 16)];
  }
  return c;
}

var voiceSelect = "Google UK English Female";
function speak(t) {
	var s = new SpeechSynthesisUtterance();
	s.text = t;
  s.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect; })[0];
	speechSynthesis.speak(s);
}

function rndNo(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function cloneRectanlge(rec) {
  return new rectanlge(rec.x, rec.y, rec.w, rec.h);
}

function collision(rx, ry, rw, rh, r2x, r2y, r2w, r2h) {
  return (rx < r2x + r2w &&
    rx + rw > r2x &&
    ry < r2y + r2h &&
    ry + rh > r2y);
}

function rectColiding(rec1, rec2) {
  return (rec1.x < rec2.x + rec2.w &&
    rec1.x + rec1.w > rec2.x &&
    rec1.y < rec2.y + rec2.h &&
    rec1.y + rec1.h > rec2.y)
}

function vec2(x,y){
  this.x = x;
  this.y = y;

  this.set = function(x,y) {
    this.x = x;
    this.y = y;
  }
}

function renderStarField(time){
  ctx.fillStyle='#FFF';
  for(let i=2e3;i--;){
    x = (Math.sin(i)*1e9-time/2e3*(i+1e3)/50)%(mg.canvas.width+9)-9;
    y = i*9%canvasW;
    s = i%5;
    ctx.fillRect(x,y,s,s);
  }
}

function warp(t) {
  for(i=200;i--;
    ctx.fillRect(canvasW/2+i*Math.sin(i)*Z, 423+i*Math.cos(i*9)*Z,Z,Z))
    ctx.fillStyle="rgba(255,255,255," + (i+.1) + ")",
    Z=2**Math.tan(i/9+t/3)
}

function drawImage(c, image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, scale, alpha){
  c.save();
  c.globalAlpha = alpha;
  //c.translate(x, y); Why is this used for the mobs?
  c.drawImage(image, sx, sy, sWidth, sHeight, dx*aspectRatio, dy*aspectRatio, dWidth*aspectRatio, dHeight*aspectRatio);
  c.restore();
}

// TODO: Remove?
function drawImg(ctx, img, sx, sy, w, h, x, y, alpha, scale){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.drawImage(img, sx, sy, w, h, w/2*scale, h/2*scale, w * scale, h * scale);
  ctx.restore();
}

function drawBox(ctx,a,colour,x,y,w,h) {
  ctx.globalAlpha = a;
  ctx.fillStyle = colour;
  ctx.fillRect(x*aspectRatio, y*aspectRatio, w*aspectRatio, h*aspectRatio);
}

function drawRect(ctx, ox, oy, x, y, w, h, col, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(ox, oy);
  ctx.fillStyle = col;
  ctx.fillRect(x,y,w,h);
  ctx.restore();
}

function writeTxt(ctx,a,font,colour,txt,x,y) {
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.fillText(txt, x*aspectRatio, y*aspectRatio);
}

function resizeCanvas(){
  // Needs to handle screens smaller than 800x600
  canvasW = window.innerWidth-border;
  canvasH = window.innerHeight-border;
  aspectRatio = canvasH / GAME_HEIGHT;

  if(ctx.canvas.width >= canvasW){
    aspectRatio = canvasW/ GAME_WIDTH;
  }

  ctx.canvas.width = GAME_WIDTH * aspectRatio;
  ctx.canvas.height = GAME_HEIGHT * aspectRatio;
  console.log("Canvas width: " + ctx.canvas.width + " Screen Width: " + canvasW);
  console.log("Canvas height: " + ctx.canvas.height + " Screen Height: " + canvasH);
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.save;
}
