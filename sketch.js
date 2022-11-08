let vy,ay,vx,ax,x,y,m,r,ra;
let port;
let connectBtn;
let mySound, reverb;
let osc, playing, freq, amp;
let mycolor;
starX=0; //X of Random stable star's X;
starY=0; //Y of Random stable star's Y;
stari=0; //number of stable star;


var pot1 = 0, pot2 = 0, pot3 =0;
var lastpot1= 0, lastpot2= 0, lastpot3= 0;
let monoSynth;

var notenumber = 1;
function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('assets/star.mp3');
}
var offsetAngle =0,
    particle,
    particles =[],
    ctx;

function setup(){
 ctx = createCanvas(windowWidth, windowHeight);  
 // colorMode(HSB, 100);
  // blendMode(ADD);
  noStroke();
  background(0,0,0);  
  vy=0;
  ay=0;
  vx=0;
  ax=0;
  r= 1;
  ra=1;
  x = width/2;
  y = height/2;
  m = 0;
  port = createSerial();
  mySound.play();
 
  reverb = new p5.Reverb();
  reverb.process(mySound, 3, 2);
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }
monoSynth = new p5.MonoSynth();
  
  
 }


function draw() {
  // clear();
   
 
  background(17,5);  
  Starings();
  offsetAngle += 0.05;
  let dryWet = map(x,0,width,0,1);
  mycolor = map(y,0,height,0.5,1);
  // 1 = all reverb, 0 = no reverb
  reverb.drywet(dryWet);
 fill(128,234*mycolor,237);
  circle(x,y,r);
  
  
  //volume control
  if(x<=width/2){
    vol = map(x,0,width/2,0,1)
  }
  if(x>width/2){
     vol = map(x,width/2,width,1,0)
  }
  
  mySound.amp(vol);
   //volume control
  
  
  r = r + ra;
  if(r > 50 || r<0){
    ra = -ra
  }
  
  getData();
  itemMove();
  boarder();
  speedLimit()

  
  if (x > 0 && y > 0) {
    makeParticles(2, x, y);
  } else {
    makeParticles(2, width/2, height/2)
    x= width/2;
    y=width/2
  }
    for (i=0; i<particles.length; i++) {
    var p = particles[i];
    p.render();
    p.update();
  }
	while(particles.length> 1000) particles.shift();
  
}

function playSynth() {
  userStartAudio();

  let note = createVector('F4', 'G4', 'A4');
  let picknote = note.array();
  
  // note velocity (volume, from 0 to 1)
  let velocity = 1;
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/12;
  // notenumber = random(1,5)
  notenumber = int(random(-0.01,2.99)) 
  console.log(picknote[notenumber])

  monoSynth.play(picknote[notenumber], velocity, time, dur);
}

function makeParticles(pcount, mx, my) {
 
 for(var i=0; i<pcount;i++) {
   var p = new Particle(mx, my, random(35,95));
   
   var angle = PI + random(-PI,PI);
   var speed = random(4,8);
   
   p.velX = sin(angle)*speed;
   p.velY = cos(angle)*speed;
   
   p.size = random(8,18);
   
   particles.push(p);
 }
}

function Particle(x,y,h) {
  this.posX = x; 
	this.posY = y; 
	this.velX = 0; 
	this.velY = 0; 
	this.shrink = .95; 
	this.size = 1; 	
	this.drag = 0.9; 
	this.gravity = 0.2; 
  this.hue = h;
  
   this.update = function() {
     this.velX *= this.drag; 
     this.velY *= this.drag;

     this.velY += this.gravity; 

     this.posX += this.velX;
     this.posY += this.velY; 

     this.size *= this.shrink;
     // this.alpha -= this.fade; 	 
    };
  
    this.render = function() {
      fill(128,234*mycolor,237);
      ellipse(this.posX, this.posY, this.size);
	};
	
    
}
function getData(){
    let str = port.readUntil("\n");
  if (str.length > 0) {
    text(str, 10, height-25);
  }
  
  if (str != null) {
    //console.log(stringFromSerial);
    if (str.length > 0) {           
      var trimmedString = trim(str);  // get rid of all white space
      var myArray = split(trimmedString, ",")      // splits the string into an array on commas
      pot1 = Number(myArray[0]);             // get the first item in the array and turn into integer
      pot2 = Number(myArray[1]); 					 // get the second item in the array and turn into integer    
       pot3 = Number(myArray[2]);
    }
  } 
}
function itemMove(){
  x = x + vx;
  vx= vx+ ax;
  y = y + vy;
  vy= vy+ ay;
  if(pot2>0.20){
    ax = map(pot2,0.21,1,0,-0.5)
    
  }
  if(-0.1<=pot2<=0.1){
    ax = 0;
  }
 if(pot2<-0.20){
   ax = map(pot2,-0.21,-1,0,0.5)
   
  }
  
    if(pot1>0.20){
    ay = map(pot1,0.21,1,0,-0.5)
    
  }
  if(-0.1<=pot1<=0.1){5
    ay = 0;
  }
 if(pot1<-0.20){
   ay = map(pot1,-0.21,-1,0,0.5)
  }
}
function boarder(){
   if(x > width-r/2){
    // if(vx>=2){
    //   vx= -0.8*vx
    // }else{
    //   vx = - vx
    // }
    vx = -vx;
    playSynth()
    
  }
    if(x < r/2){
    // vx= -0.8*vx
      vx = -vx;
       playSynth()
  }
    if(y > height-r/2){
    // if(vy>=2){
    //   vy= -0.8*vy
    // }else{
    //   vy= -vy
    // }
      vy = -vy
      playSynth()
  }
        if(y < r/2){
    // vy= -0.8*vy
          vy = -vy
          playSynth()
  }
}
function speedLimit(){
    if(vx > 2 ){
    vx = 2;
  }
   if(vx < -2 ){
    vx = -2;
  }
   if(vy > 2 ){
    vy = 2;
  }
   if(vy < -2 ){
    vy = -2;
  }

}
function Starings(){
      if(0<stari<5000){
    stari=stari+1;
  starX= random(width);
  starY = random(height);
  stroke(random(200,255));
  strokeWeight(random(2))
  point(starX,starY);
   noStroke();
    }
  
}