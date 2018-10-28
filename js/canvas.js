var mouseArrayX = [];
var mouseArrayY = [];
const mouseArrayLength = 30;
const mousePointSize = 10;
var mousePointColor = [Math.random()*255,Math.random()*255,Math.random()*255];
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
    for(let i=0; i<mouseArrayLength; i++){
        mouseArrayX[i] = mouseX;
        mouseArrayY[i] = mouseY;
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
        drawMousePoint();
}


function resetCanvas(){
    fill(255);
    rect(0,0,width,height);
}

function drawMousePoint(){

    //配列の定義
    for(let i = mouseArrayLength-1; i >= 1; i--){
        mouseArrayX[i] = mouseArrayX[i-1];
        mouseArrayY[i] = mouseArrayY[i-1];
    }
    mouseArrayX[0] = mouseX;
    mouseArrayY[0] = mouseY;

    //配列間の線描画
    for(let i=0; i< mouseArrayLength-1; i++){
        const size = mousePointSize-(mousePointSize/mouseArrayLength*i);
        strokeWeight(size);
        line(mouseArrayX[i],mouseArrayY[i],mouseArrayX[i+1],mouseArrayY[i+1]);
    }
}

function randomLineColor(){
    let randomMax = 10;
    for(let i=0; i<3; i++){
        let randomValue = Math.random()*randomMax;
        let changeValue = mousePointColor[i] + randomValue-(randomMax/2);
        if(changeValue>=0 && changeValue<=255){
            mousePointColor[i] = changeValue;
        }
    }
    stroke(mousePointColor[0],mousePointColor[1],mousePointColor[2]);
}

function questionText(){
    textSize(32);
    fill(0);



    rect(50,100,20,32);
    text('wprd',100,100);
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


function playerController(){
    if(keyIsPressed){
        switch(keyCode){
            case ArrowRight:
                quizSquare.x += 1;
                break;
            default:
        }
    }
}