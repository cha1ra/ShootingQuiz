/*---------------
2018.10.28
Aira Sakajiri
---------------*/
'use strict';

const question = [
    '日本の首都は？',
    'スイスの首都は？',
    'カナダの首都は？',
    'オーストラリアの首都は？',
    'ブラジルの首都は？',
    'ミャンマーの首都は？',
]

const choices = [
    ['東京','京都','東銀座'],
    ['チューリッヒ','コペンハーゲン','ベルン'],
    ['オタワ','トロント','バンクーバー'],
    ['シドニー','キャンベラ','メルボルン'],
    ['リオデジャネイロ','サンパウロ','ブラジリア'],
    ['ネピドー','ヤンゴン','マンダレー']
]

const answer = [0,2,0,1,2,0];

const MAX_QUIZ_NUMBER = question.length;
var currentQuizNum = 0;
var quizFlag = true;


class Quiz {
    constructor(question, choices, answer){
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }

    isAnswerCorrect(choice){
        console.log('answer:'+this.answer+'\nchoice:'+choice);
        if(choice == this.answer)return true;
        return false;
    }

    setData(num){
        this._question = question[num];
        this._choices = choices[num];
        this._answer = answer[num];
    }

    changeHtml(){
        $('#question').html(this.question);
        for(let i=0; i<3; i++){
            $('#ans'+i).html(this.choices[i]);
        }
    }

    get question(){return this._question;}
    get choices(){return this._choices;}
    get answer(){return this._answer;}

    set question(val){this._question = val;}
    set choices(val){this._choices = val;}
    set answer(val){this._answer = val;}
}





$('#start').on('click',function(){
    $('#title').addClass('hidden');
    $('#canvas').removeClass('hidden');
});

var quiz = new Quiz();
var quizNumber = 1;
quiz.setData(quizNumber-1);

/*---------------
Animation @using P5.js
---------------*/
var scene = 0;

var isQuizNumFadeOut = false;
var quizNumFadeOutCounter = 0;

var quizDescriptionTimer = 0;

var readyCounter = 0;

var playerResult;

//game
var pointerArrayX = [];
var pointerArrayY = [];
const pointerArrayLength = 20;
const pointerPointSize = 10;
var pointerColor = [Math.random()*255,Math.random()*255,Math.random()*255];
var pointerSpeed = {x:0,y:0};
var pointerSpeedFlag = {up:false,down:false,left:false,right:false};
var quizSquare = [];
var selection = ['A','B','C'];
var selectionLength = selection.length;
 
var chargeMeter = -90;
var chargeEnergyFlag = false;

var fireFlowerFlag = false;
var currentFireFlowerTime = 0;
var maxFireFlowerTime = 40;
var firePosX, firePosY;
var fireFlowerLevel = 0;
var fireFadeOutCount = 0;

//layout
var titleDivH;
var fieldDivH;

//result
var playerAnswer;
var blackOutCounter = 0;

//bgm
var bgm,beam,charge,enter,ok,ng,count ;

class PlayerResult{
    constructor(){
        this.correctNum = 0;
        this.quizResult = [];
        this.answerTime = [];
        this.shootNum = 0;
        this.hitNum = 0;
    }
    get correctNum(){return this._correctNum}
    set correctNum(val){this._correctNum = val}
}

class QuizSquare{

    constructor(x,y,w,h,maxLifePoint,selection){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxLifePoint = maxLifePoint;
        this.selection = selection;
        this.currentLifePoint = maxLifePoint;
        this.attackedFlag = false;
        this.rotateSpeed = 12;

        this.maxW = w;
        this.maxH = h;
        this.minW = w*0.5;
        this.minH = h*0.5;

        this.speedX = 5;
        this.speedY = 5;

        this.grav = 0.02;
    }

    draw(){
        push();
        this.rotateSquare();
        pop();
        this.text(this.selection);
    }

    text(sel){
        if(!this.isSelected()){
            textSize(24);
            textAlign(CENTER, CENTER);
            fill(255);
            text(sel,this.x,this.y);  
        }
    }

    rotateSquare(){
        if(!this.isSelected()){
            stroke(200,200,200);
            fill(0,0,0);
            translate(this.x,this.y);
            this.drawLifePointBar();

            if(this.nextW<this.w || this.nextH<this.h){
                rotate(millis()*this.rotateSpeed*1.2);
                this.w -= 0.5;
                this.h -= 0.5;
            }else{
                rotate(millis()*this.rotateSpeed / 180);
            }
            const randomW = this.w + Math.random()*10;
            const randomH = this.h + Math.random()*10;
            rect(randomW/2*-1,randomH/2*-1,randomW,randomH);
            ellipse(0,0,this.w,this.h);
        }
    }

    drawLifePointBar(){
        rect(this.maxW/2*-1,this.h+5,this.maxW,5);
        fill(255);
        rect(this.maxW/2*-1,this.h+5,this.maxW*this.currentLifePoint/this.maxLifePoint,5);
        noFill();
    }

    damage(attackPoint){
        this.currentLifePoint = this.currentLifePoint - attackPoint;
        if(this.currentLifePoint <= 0){
            this.currentLifePoint = 0;
        }
        this.attackedFlag = true;
        let damageRate = this.currentLifePoint/this.maxLifePoint;
        console.log(damageRate);
        this.nextW = this.minW + (this.maxW-this.minW)*damageRate;
        this.nextH = this.minH + (this.maxH-this.minW)*damageRate;
    }

    isSelected(){
        if(this.w<=this.minW || this.h<=this.minH)return true;
        else return false;
    }

    get x(){return this._x}
    get y(){return this._y}
    get w(){return this._w}
    get h(){return this._h}
    get maxLifePoint(){return this._maxLifePoint}

    set x(val){this._x = val}
    set y(val){this._y = val}
    set w(val){this._w = val}
    set h(val){this._h = val}
    set maxLifePoint(val){this._maxLifePoint = val}
}

function preload(){
    bgm = loadSound('./src/bgm.mp3');
    beam = loadSound('./src/beam.mp3');
    charge = loadSound('./src/charge.mp3');
    ng = loadSound('./src/ng.mp3');
    ok = loadSound('./src/ok.mp3');
    enter = loadSound('./src/enter.mp3');
    count = loadSound('./src/count.mp3');
}

playerResult = new PlayerResult;

function setup() {
    let canvas = createCanvas(960,540);
    canvas.parent('canvas');
    angleMode(DEGREES);
    smooth();
    frameRate(60);

    titleDivH = 80;
    fieldDivH = height - titleDivH;

    for(let i=0; i<pointerArrayLength; i++){
        pointerArrayX[i] = width/2;
        pointerArrayY[i] = height/2;
    }
    for (let i=0;i<selectionLength;i++){
        quizSquare[i] = new QuizSquare(width*(i+1)/4,titleDivH+(fieldDivH/2),70,70,5,selection[i]);
    }

}

function draw() {
    randomLineColor();
    switch(scene){
        case 0://タイトル
            quizNumTitle();
            break;
        case 1://問題文
            quizDescription();
            if(!bgm.isPlaying())bgm.play();
            break;
        case 2://カウントダウン
            readyCountDown();
            break;
        case 3://シューティングゲーム
            resetCanvas();
            questionText(titleDivH);
            for(let i=0;i<selectionLength;i++){
                quizSquare[i].draw();
            }
            computePointerSpeed();
            chargeEnergy();
            push();
                fireFlower();
            pop();
                drawMousePoint();
            if(isSelectAnswer())scene++;
            break;
        case 4://ブラックアウト
            blackOut();
            break;
        case 5://結果画面
            selectedResult();
            bgm.stop();
            break;
        case 6://最終結果
            allResult();
            break;
    }
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

    reflectPointer();

    function reflectPointer(){
        if(pointerArrayX[0]<0 ||pointerArrayX[0]>width){
            pointerSpeed.x *= -1;
        }
        if(pointerArrayY[0]<titleDivH || pointerArrayY[0]>height ){
            pointerSpeed.y *= -1;
        }
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

function questionText(boxHeight){
    fill(0);
    rect(0,0,width,boxHeight);
    fill(255);
    textAlign(CENTER,BOTTOM);
    textSize(24);
    text(quiz.question,width/2,boxHeight/2);
    textSize(18);
    text(`[A]${quiz.choices[0]}  [B]${quiz.choices[1]}  [C]${quiz.choices[2 ]}`,width/2,boxHeight*0.95);
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
            charge.play();
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
            charge.stop();
            break; 
        default:
    }
}


function computePointerSpeed(){
    let maxSpeed = 7;
    let accr = 0.3;
    let grav = 0.08;

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
        if(!beam.isPlaying())beam.play(); 
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
        fireFadeOutCount = 0;
        fireFlowerFlag =false;
        beam.stop()
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
    for(let i=0; i<selectionLength; i++){
        if(pow(pointerArrayX[0]-quizSquare[i].x,2)+pow(pointerArrayY[0]-quizSquare[i].y,2)<pow(quizSquare[i].w/2,2)){
            console.log('hit!');
            quizSquare[i].damage(1);
        }else{
            console.log('out!');
        }
    }
}

function isSelectAnswer(){
    var gameset = false;
    for(let i=0; i<selectionLength; i++){
        if(quizSquare[i].w<=quizSquare[i].minW || quizSquare[i].h <= quizSquare[i].minH){
            gameset = true;
            playerAnswer = i;
        }
    }
    return gameset;
}


function blackOut(){
    fill(0,0,0,10);
    rect(0,0,width,height);
    blackOutCounter++;
    if(blackOutCounter>60){
        blackOutCounter = 0;
        scene++;
    }
}


function quizNumTitle(){
    resetCanvas();
    if(keyIsPressed){
        isQuizNumFadeOut = true;
        if(!enter.isPlaying())enter.play();
    }
    if(isQuizNumFadeOut)quizNumFadeOutCounter+=3;
    if(quizNumFadeOutCounter<255){
        noStroke();
        fill(255-quizNumFadeOutCounter);
        textAlign(CENTER,CENTER);
        textSize(80);
        text('Question ' + quizNumber,width/2,height/2);
        textSize(18);
        text('Press Any Key...',width/2,height/3*2);
    }else{
        isQuizNumFadeOut = false;
        quizNumFadeOutCounter = 0;
        scene++;
    }
}

function quizDescription(){
    resetCanvas();
    if(quizDescriptionTimer>100){
        let move = height/2-((quizDescriptionTimer-100)*(quizDescriptionTimer-100)/7);
        if(move>0){
            translate(0,move);
        }else{
            scene++;
            quizDescriptionTimer = 0;
        }
    }else{
        translate(0,height/2);
    }
    questionText(titleDivH);
    quizDescriptionTimer++
}


function readyCountDown(){    
    let counter = 3-Math.floor(readyCounter/60);
    if(readyCounter%60==0)count.play();
    if(counter != 0){
        let centerW = width/2
        let centerH = titleDivH+(fieldDivH/2)
    
        fill(0);
        rect(0,titleDivH,width,fieldDivH);

        noFill();
        strokeWeight(4);
        arc(centerW, centerH, 150, 150, -90, -90 + 360/60*(readyCounter%60));
        strokeWeight(3);
    
        textAlign(CENTER,CENTER);
        textSize(80);
        text(counter,centerW,centerH);
        readyCounter++;
        strokeWeight(1);
    }else{
        readyCounter = 0;
        scene++;
    }
}

function selectedResult(){
    if(keyIsPressed){
        isQuizNumFadeOut = true;
        if(!enter.isPlaying())enter.play();
    }
    if(isQuizNumFadeOut)quizNumFadeOutCounter+=3;
    if(quizNumFadeOutCounter<255){
        resetCanvas();
        let result = "正解"
        if(playerAnswer != quiz.answer){
            result = '不' + result;
            //if(quizNumFadeOutCounter<=3)ng.play();
        }else{
            //if(quizNumFadeOutCounter<=3)ok.play();
        }
        noStroke();
        fill(255-quizNumFadeOutCounter);
        textAlign(CENTER,CENTER);
        textSize(80);
        text(result,width/2,height/3);
        textSize(32);
        text(`Your Choice : ${quiz.choices[playerAnswer]}\nAnswer : ${quiz.choices[quiz.answer]}`,width/2,height/5*3);
        textSize(18);
        text(`Press anykey to continue...`,width/2,height/5*4);
    }else{
        if(playerAnswer == quiz.answer){
            playerResult.correctNum = playerResult.correctNum+1;
            console.log("playerResult.correctNum" + playerResult.correctNum);
        }
        isQuizNumFadeOut = false;
        quizNumFadeOutCounter = 0;
        scene = 0;
        setup();
        //次の問題
        if(quizNumber<question.length){
            quizNumber++;
            quiz.setData(quizNumber-1);
        }else{
            scene = 6;
        }
    }
}

function allResult(){
    resetCanvas();
    $('#canvas').fadeOut();
    $('#result').fadeIn();
    $('#result').removeClass('hidden');
    $('.correct-number').text(playerResult.correctNum);
}


/*
疑問箱
プロパティの宣言方法
■フォントの変更方法
http://blog.livedoor.jp/reona396/archives/55711682.html
■親キャンバスの設定方法
https://qiita.com/uto-usui/items/3dc216f7c1bab3b90e0e
*/