let state = 0;
let nameText;
let player;
let pallete;
let colorPicker;
let dangerColor;
let dangerPicker;
let crumb;
let crumbs = [];
let crumbAmount;
let dangers = [];
let dangerAmount = 0;
let particles = [];
let buttonX, buttonY;
let buttonXW;
let buttonYW;
let playerSize;
let foodSize;
let playerSpeed;
let textGrow;
let slider;
let sliderLabel;
let maxDanger = 200;
let hasRun;

let score;
let millisecs;
let seconds;
let minutes;
let fpsLabel;

let leaderboard;
let word;
let eatSound;
let crash;
const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = 'highScores';
const highScoreString = localStorage.getItem(HIGH_SCORES);


function preload(){
  eatSound = loadSound('media/impact.mp3');
  crash = loadSound('media/lose.mp3');
}


function setup() {
  let cnv = createCanvas(700, 500);
  //document.getElementById("content").appendChild(cnv);
  cnv.parent("content");
  cnv.style('width', '100%');
  cnv.style('height', '100%');
  showHighScores();
  
  score = 0;
  millisecs = 0;
  seconds = 0;
  minutes = 0;
  crumbAmount = 50;

  leaderboard = localStorage.getItem('playerScore');

  playerSize = 50;
  playerSpeed = 2.5;
  textGrow = 15;
  player = new human(width/2, height/2, playerSize, "abraiz", textGrow);
  pallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
  dangerColor = [color('#621708'), color('#941b0c'), color('#bc3908'), color('#f6aa1c')];
  // pallete = ['#7400b8', '#e67e22', '#5e60ce', '#5390d9', '#4ea8de', color('48bfe3,'), '#56cfe1', '#64dfdf', '#72efdd', '#80ffdb'];
    colorPicker = random(pallete);
    console.log(colorPicker);
    // dangerPicker = random(dangerColor);
    
    noiseDetail(24);

    buttonXW = 200;
    buttonYW = 50;

    foodSize = 20;    

    hasRun = false;

    // nameText = createInput();
    // nameText.position(width/2, height/2-80);

    for (let i = 0; i <crumbAmount; i++){
      crumbs[i] = new food(random(width*2), random(height*2), foodSize);
      
    }
   // dangerAmount = 5;




    for (let i = 0; i <  500; i++){
      let tempParticle = new Particle(random(width*2), random(height*2), 5, random(pallete));
      particles.push(tempParticle);
    }

    sliderLabel = createElement('h4', 'difficulty level');
    sliderLabel.parent("slider");
    // sliderLabel.style('width', '100%');
    // sliderLabel.style('height', '100%');
    // sliderLabel.style('color', '#f2f2f2');
    // sliderLabel.style('text-align', 'center');
    // sliderLabel.style('padding', '14px 16px');
    // sliderLabel.style('text-decoration', 'none');

    slider = createSlider(0, maxDanger, 50, 1);
   // slider.position(width/2, height/2);
    slider.parent("slider");
    slider.style('width', '100%');
    slider.style('height', '100%');



    
    // cnv.style('width', '100%');
    // cnv.style('height', '100%');

} 

function draw() {
  // play a different portion of the game based on which state we are in
  if (state == 0) {
    gameStart();
  }
  else if (state == 1) {
    gamePlaying();
  }
  else {
    
    gameEnd();
  }
  // let fps = frameRate();
  // fill(255);
  // stroke(3);
  // strokeWeight(2);
  // fpsLabel = createElement('p', "FPS: " + fps.toFixed(2), width-125, height - 25);
  // fpsLabel.parent("slider");

}

function gameStart() {
  background(20);
  for(let i = particles.length -1; i >= 0; i--){
    particles[i].playMove();
    particles[i].display();
    
  }
  // fill(0);
  // stroke(0);
  
  // text("'start' mode - click to switch to 'play' mode", 20, 50);
  //buttonX = 200;
  buttonY = 200;

  fill(255);
  textSize(15);
  text("last score: "  + leaderboard, 20, 20);
  
  drawButton(mouseX, mouseY);

}

function addDanger(){
  if(hasRun) return;
  let val = slider.value();
  dangerAmount += val;

  for (let i = 0; i <dangerAmount; i++){
    dangers[i] = new Danger(dangerSpawnX(), dangerSpawnY(), 50, random(dangerColor));
    
  }
  hasRun = true;
}

function randomNumber(min, max) { 
  return Math.floor(Math.random() * (max - min) + min);
} 

function dangerSpawnX(){
  let xL = randomNumber(-width, width/2-50);
  let xR = randomNumber(width/2+50, width*2);

  let temp = [xL, xR];
  let x = temp[Math.floor(Math.random() * temp.length)];

  return x;

}

function dangerSpawnY(){
  let yU = randomNumber(-height, height/2-50);
  let yD = randomNumber(height/2+50, height*2);
  let temp = [yU, yD];

  let y = temp[Math.floor(Math.random() * temp.length)];

  return y;

}



function gamePlaying() {
  addDanger();
  slider.remove();
  sliderLabel.remove();
  background(240, 70);



 if (int(millis()/100)  % 10 != millisecs){
  millisecs++;
  
}
if (millisecs >= 10){
  millisecs -= 10;
  seconds++;
}
if (seconds >= 60){
  seconds -= 60;
  minutes++;
}

fill(255);
stroke(0);
strokeWeight(2);
textSize(15);
text("Mass: " + score, 15, 22);
text(nf(minutes, 2) + ":" + nf(seconds, 2) + "." + nf(millisecs, 1) , 15, 40);

  translate(width/2-player.position.x, height/2-player.position.y);

  for(let i = crumbs.length -1; i >= 0; i--){
    crumbs[i].display(colorPicker);
    crumbs[i].checkHit(i);
  } 

  for(let i = dangers.length -1; i >= 0; i--){
    dangers[i].display();
    dangers[i].checkHit(i);
  }

  for(let i = particles.length -1; i >= 0; i--){
    particles[i].playMove();
    particles[i].display();
    
  }
  player.display(colorPicker); 
  player.move();

}

function gameEnd() {
  background(20);
  for(let i = particles.length -1; i >= 0; i--){
    particles[i].playMove();
    particles[i].display();
    
  }
  stroke(255);
   restartButton(mouseX, mouseY);

}

function mousePressed() {

  let clicked = isButtonPressed(mouseX, mouseY);

  let restart = isRestartButtonPressed(mouseX, mouseY);

  if (clicked == true) {
    // switch to state 1
    state = 1;
  }
  else if (restart == true) {
    checkHighScore(score);
    localStorage.setItem('playerScore', score);
    reset();
    state = 0;
  }
}

function nameFunction(name) {
  // grab the string from the text box
  word = name.value;

  return word;
}


class human {
constructor(x, y, size, name, textGrow){
  this.x = x;
  this.y = y;
  this.position = createVector(x, y);
  this.size = size;
  this.name = name;
  this.textGrow = textGrow;
}

move(){
  let vel = createVector(mouseX-width/2, mouseY- height/2);
  vel.setMag(playerSpeed);
  //console.log(vel);
  this.position.add(vel);
}

  display(colorPicker){
    fill(colorPicker);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    textSize(this.textGrow);
    fill(255);
    textAlign(CENTER);
    text(word, this.position.x,this.position.y+1);
    fill(0, 102, 153, 51);
  }
}

class food {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display(colorPicker){
    stroke(255);
    fill(colorPicker);
    ellipse(this.x, this.y, this.size, this.size);
  }

  checkHit(i){
     let d = dist(this.x, this.y, player.position.x, player.position.y);
     if (d < player.size/2){
      console.log("eatin");
      crumbs.splice(i, 1);
      player.size += 10;
      player.textGrow += 2;
      score += 3;
      playerSpeed -= 0.1;
      console.log(playerSpeed);
      eatSound.play();
     // player.position.add(vel);
  
      if(crumbs.length == 0){
        for (let i = 0; i <15; i++){
          crumbs[i] = new food(random(width*2), random(height*2), foodSize);
          
        }

      }
     }
   }


}

class Danger {
  constructor(x, y, size, color){
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;

    this.xOffset = random(0, 1000);
    this.yOffset = random(1000, 2000);
  }

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);

    let xMovement = map( noise(this.xOffset), 0, 1, -1, 1 );
    let yMovement = map( noise(this.yOffset), 0, 1, -1, 1 );

    this.x += xMovement;
    this.y += yMovement;

    this.xOffset += 0.005;
    this.yOffset += 0.005;
  }

  checkHit(){
    stroke(0);

     let d = dist(this.x, this.y, player.position.x, player.position.y);
     if (d < player.size/2+ this.size/2){
      crash.play();
      state = 2;
      console.log("you died: "+ state);

     }
  }

}

class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.color = color;

    this.xOffset = random(0, 1000);
    this.yOffset = random(1000, 2000);
  
  }

  display(){
    noStroke();
    fill(this.color, 100);
    glow(color(255), 8);
    rect(this.x, this.y, this.size, this.size);
  }

  startMove(){
    let xMovement = map( noise(this.xOffset), 0, 1, -1, 1 );
    let yMovement = map( noise(this.yOffset), 0, 1, -1, 1 );

    // update our position
    this.x += xMovement;
    this.y += yMovement;

   // handle wrap-around
    if (this.x > width) {
      this.x = 0;
    }
    else if (this.x < 0) {
      this.x = width;
    }
    if (this.y > height) {
      this.y = 0;
    }
    else if (this.y < 0) {
      this.y = height;
    }

      // update our noise offset values
      this.xOffset += 0.01;
      this.yOffset += 0.01;
  }


  playMove(){
    let xMovement = map( noise(this.xOffset), 0, 1, -1, 1 );
    let yMovement = map( noise(this.yOffset), 0, 1, -1, 1 );

    // update our position
    this.x += xMovement;
    this.y += yMovement;

    // handle wrap-around
    if (this.x > width*2) {
      this.x = 0;
    }
    else if (this.x < -width) {
      this.x = width*2;
    }
    if (this.y > height*2) {
      this.y = 0;
    }
    else if (this.y < -height) {
      this.y = height*2;
    }

      // update our noise offset values
      this.xOffset += 0.01;
      this.yOffset += 0.01;
  }
}

// function to draw our button
function drawButton(testX, testY) {
  if (testX > width/2-buttonXW/2 && testX < width/2-buttonXW/2+buttonXW && testY > buttonY && testY < buttonY + buttonYW) {
    fill('#5e60ce');
  }
  else {
    fill(255);
  }

  rect(width/2-buttonXW/2, buttonY, buttonXW, buttonYW);
  noStroke();
  fill(0);
  textSize(15);
  text("start", width/2-buttonXW/2+buttonXW/2-10, buttonY+30)
}

// draw our button
function restartButton(testX, testY) {

  if (testX > width/2-buttonXW/2 && testX < width/2-buttonXW/2+buttonXW && testY > buttonY && testY < buttonY + buttonYW) {
    fill('#5e60ce');
  }
  else {
    fill(255);
  }

  rect(width/2-buttonXW/2, buttonY, buttonXW, buttonYW);
  noStroke();
  fill(0);
  textSize(15);
  text("restart", width/2-buttonXW/2+buttonXW/2-15, buttonY+30)
}

// check for button presses
function isButtonPressed(testX, testY) {
  while(state == 0){
    millisecs = 0;
    seconds = 0;
    minutes = 0;
    if (testX > width/2 && testX < width/2+buttonXW && testY > buttonY && testY < buttonY + buttonYW) {
      return true;
    }
      else {
        return false;
      }
    }
  }

  function isRestartButtonPressed(testX, testY) {

    while(state == 2){
      if (testX > width/2 && testX < width/2+buttonXW && testY > buttonY && testY < buttonY + buttonYW) {
        return true;
      }
        else {
          return false;
        }
      }
    }

  function glow(glowColor, blurriness){
    drawingContext.shadowBlur = blurriness;
    drawingContext.shadowColor = glowColor;
  }

  function reset(){
    state = 0;
    score = 0;

    playerSize = 50;
    playerSpeed = 3;
    textGrow = 15;
    player = new human(width/2, height/2, playerSize, "abraiz", textGrow);
    colorPicker = random(pallete);
    noiseDetail(24);

    buttonXW = 200;
    buttonYW = 50;

    foodSize = 20;    
    crumbs = [];
    dangers = [];

    for (let i = 0; i <crumbAmount; i++){
      crumbs[i] = new food(random(width*2), random(height*2), foodSize);
      
    }
    dangerAmount = 5;

    sliderLabel = createElement('h4', 'difficulty level');
    sliderLabel.parent("slider");

    slider = createSlider(0, maxDanger, 50, 1);
    slider.parent("slider");
    slider.style('width', '100%');
    slider.style('height', '100%');

    leaderboard = localStorage.getItem('playerScore');

    hasRun = false;
  }


  function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
    
    if (score > lowestScore) {
      saveHighScore(score, highScores);
      showHighScores();
    }
  }
  
  function saveHighScore(score, highScores) {
    const name = prompt('You got a highscore! Enter name:');
    const newScore = { score, name };
    
    // 1. Add to list
    highScores.push(newScore);
  
    // 2. Sort the list
    highScores.sort((a, b) => b.score - a.score);
    
    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  };
  
  function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const highScoreList = document.getElementById(HIGH_SCORES);
    
    highScoreList.innerHTML = highScores
      .map((score) => `<li>${score.score} - ${score.name}`)
      .join('');
  }