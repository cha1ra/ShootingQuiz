

var pointerArrayX = [];
var pointerArrayY = [];
const pointerArrayLength = 20;
const pointerPointSize = 10;
var pointerColor = [Math.random()*255,Math.random()*255,Math.random()*255];
var pointerSpeed = {x:0,y:0};
var pointerSpeedFlag = {up:false,down:false,left:false,right:false};
var quizSquare;

var chargeMeter = -90;
var chargeEnergyFlag = false;

var fireFlowerFlag = false;
var currentFireFlowerTime = 0;
var maxFireFlowerTime = 40;
var firePosX, firePosY;
var fireFlowerLevel = 0;
var fireFadeOutCount = 0;

class QuizSquare{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    rotate(){
        stroke(200,200,200);
        fill(0,0,0);
        translate(this.x,this.y);
        if(mouseIsPressed){
            rotate(millis()*20);
            if(this.w>0 && this.h>0){
                this.w -= 2;
                this.h -= 2;
            }else{
                this.w = 0;
                this.h = 0;      
            }
        }else{
            rotate(millis()*6 / 360);
        }
        rect(this.w/2*-1,this.h/2*-1,this.w,this.h);
    
        ellipse(0,0,this.w,this.h);
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
    createCanvas(960,480);
    angleMode(DEGREES);
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
        quizSquare.rotate();
    pop();
        randomLineColor();
        computePointerSpeed();
        chargeEnergy();
    push();
        fireFlower();
    pop();
        drawMousePoint();
}


function resetCanvas(){
    fill(0);
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
        case 32://SPACE
            chargeEnergyFlag = true;
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
        case 32://SPACE
            chargeEnergyFlag = false;
            fireFlowerFlag = true;
            isShootHit();
            break; 
        default:
    }
}


function computePointerSpeed(){
    let maxSpeed = 7;
    let accr = 0.5;
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
    if(pointerSpeed.x!=0){
        if(pointerSpeed.x<0){
            pointerSpeed.x += grav;
        }else{
            pointerSpeed.x -= grav;
        }
    }
    if(pointerSpeed.y!=0){
        if(pointerSpeed.y<0){
            pointerSpeed.y += grav;
        }else{
            pointerSpeed.y -= grav;
        }
    }

    if(!keyIsPressed){
        //スピードが抵抗以下なら止める
        if(grav*-1<pointerSpeed.x&&pointerSpeed.x<grav)pointerSpeed.x = 0;
        if(grav*-1<pointerSpeed.y&&pointerSpeed.y<grav)pointerSpeed.y = 0;
    }
    $('#log').text(pointerSpeed.x);

}

function fireFlower(){
    const flowerNum = 16;
    const easing = 0.08;
    if(fireFlowerFlag){
        if(currentFireFlowerTime==0)setInitPosition();

        translate(firePosX,firePosY);

        let destination = (maxFireFlowerTime - currentFireFlowerTime)*easing;
        currentFireFlowerTime += destination + 0.1;

        if(currentFireFlowerTime < maxFireFlowerTime){
            draw(destination);
        }else{
            fadeOut(destination);
            
        }
    }

    function setInitPosition(){
        firePosX = pointerArrayX[0];
        firePosY = pointerArrayY[0];
    }

    function fadeOut(destination){
        if(fireFadeOutCount<255){
            stroke(255-fireFadeOutCount);
            fireFadeOutCount+=10;
            draw(destination);
        }else{
            reset();
        }
    }

    function reset(){
        currentFireFlowerTime = 0;
        destination = 0;
        fireFadeOutCount = 0;
        fireFlowerFlag =false;
    }
    
    function draw(destination){
        noFill();  
        rotate(destination*10);
        ellipse(0,0,currentFireFlowerTime,currentFireFlowerTime);
        ellipse(0,0,5,5);
        for(let i=0; i<flowerNum; i++){
            rotate(360/flowerNum*i);
            rect (currentFireFlowerTime,currentFireFlowerTime,2,15);
        }
    }
}

function chargeEnergy(){

    let chargeSpeed = 10;
    effect();

    function effect(){
        if(chargeEnergyFlag){
            chargeMeter += chargeSpeed;
            noFill();
            if(chargeMeter < 270){
                arc(pointerArrayX[0], pointerArrayY[0], 50, 50, -90, chargeMeter);
            }else{
                arc(pointerArrayX[0], pointerArrayY[0], 50, 50, 0, 359);
            }
    
        }else{
            chargeMeter = -90;
        }
    }
}

//当たり判定
function isShootHit(){
    if(pow(pointerArrayX[0]-quizSquare.x,2)+pow(pointerArrayY[0]-quizSquare.y,2)<pow(quizSquare.w/2,2)){
        console.log('hit!');
    }else{
        console.log('out!');
    }
}