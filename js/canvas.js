

var pointerArrayX = [];
var pointerArrayY = [];
const pointerArrayLength = 20;
const pointerPointSize = 10;
var pointerColor = [Math.random()*255,Math.random()*255,Math.random()*255];
var pointerSpeed = {x:0,y:0};
var pointerSpeedFlag = {up:false,down:false,left:false,right:false};
var quizSquare;

class QuizSquare{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get x(){return this._x;}
    get y(){return this._y;}
    get w(){return this._w;}
    get h(){return this._h;}

    set x(val){this._x = val;}
    set y(val){this._y = val;}
    set w(val){this._w = val;}
    set h(val){this._h = val;}
}




function setup() {
    createCanvas(640,480);
    smooth();
    frameRate(60);
    for(let i=0; i<pointerArrayLength; i++){
        pointerArrayX[i] = width/2;
        pointerArrayY[i] = height/2;
    }
    quizSquare = new QuizSquare(200,200,50,50);

}

function draw() {
    resetCanvas();
    questionText();
    push();
        rotateSquare();
    pop();
        randomLineColor();
        computePointerSpeed();
        drawMousePoint();
}


function resetCanvas(){
    fill(255);
    rect(0,0,width,height);
}

function drawMousePoint(){

    //配列の定義
    for(let i = pointerArrayLength-1; i >= 1; i--){
        pointerArrayX[i] = pointerArrayX[i-1];
        pointerArrayY[i] = pointerArrayY[i-1];
    }
    pointerArrayX[0] += pointerSpeed.x;
    pointerArrayY[0] += pointerSpeed.y;

    //配列間の線描画
    for(let i=0; i< pointerArrayLength-1; i++){
        const size = pointerPointSize-(pointerPointSize/pointerArrayLength*i);
        strokeWeight(size);
        line(pointerArrayX[i],pointerArrayY[i],pointerArrayX[i+1],pointerArrayY[i+1]);
    }
}

function randomLineColor(){
    let randomMax = 10;
    for(let i=0; i<3; i++){
        let randomValue = Math.random()*randomMax;
        let changeValue = pointerColor[i] + randomValue-(randomMax/2);
        if(changeValue>=0 && changeValue<=255){
            pointerColor[i] = changeValue;
        }
    }
    stroke(pointerColor[0],pointerColor[1],pointerColor[2]);
}

function questionText(){
    textSize(24);
    fill(0);



    rect(50,100,20,32);
    text('木は木でも登れない木はなーんだ？',100,100);
}


function rotateSquare(){

    // stroke(200,200,200);
    // fill(255,255,255);
    // translate(100,100);
    // rotate(millis()*3 / 360);
    // rect(-25,-25,50,50);

    stroke(200,200,200);
    fill(255,255,255);
    translate(quizSquare.x,quizSquare.y);
    if(mouseIsPressed){
        rotate(millis()*6 / 360);
        if(quizSquare.w>0 && quizSquare.h>0){
            quizSquare.w -= 2;
            quizSquare.h -= 2;
        }
    }else{
        rotate(millis()*3 / 360);
    }

    rect(quizSquare.w/2*-1,quizSquare.h/2*-1,quizSquare.w,quizSquare.h);

}


function keyPressed(){
    let speed = 10;
    switch(keyCode){
        case UP_ARROW:
            pointerSpeedFlag.up = true;
            break;
        case DOWN_ARROW:
            pointerSpeedFlag.down = true;
            break;
        case LEFT_ARROW:
            pointerSpeedFlag.left = true;
            break;
        case RIGHT_ARROW:
            pointerSpeedFlag.right = true;
            break;
        case 32:
            console.log('space');
            break; 
        default:
    }
}

function keyReleased(){
    switch(keyCode){
        case UP_ARROW:
            pointerSpeedFlag.up = false;
            break;
        case DOWN_ARROW:
            pointerSpeedFlag.down = false;
            break;
        case LEFT_ARROW:
            pointerSpeedFlag.left = false;
            break;
        case RIGHT_ARROW:
            pointerSpeedFlag.right = false;
            break;
        default:
    }
}


function computePointerSpeed(){
    let maxSpeed = 7;
    let accr = 0.3;
    let grav = 0.3;

    //キー入力があったら加速する
    if(Math.abs(pointerSpeed.y)<maxSpeed){
        if(pointerSpeedFlag.up){
            pointerSpeed.y -= accr;
        }else if(pointerSpeedFlag.down){
            pointerSpeed.y += accr;
        }
    }
    if(Math.abs(pointerSpeed.x)<maxSpeed){
        if(pointerSpeedFlag.left){
            pointerSpeed.x -= accr;
        }else if(pointerSpeedFlag.right){
            pointerSpeed.x += accr;
        }
    }

    //抵抗を加算
    if(pointerSpeed.x<grav){
        pointerSpeed.x += grav;
    }else if(pointerSpeed.x>grav){
        pointerSpeed.x -= grav;
    }else{
        pointerSpeed.x = 0;
    }
    if(pointerSpeed.y<grav){
        pointerSpeed.y += grav;
    }else if(pointerSpeed.y>grav){
        pointerSpeed.y -= grav;
    }else{
        pointerSpeed.y = 0;
    }
}

function fireFlower(){

}