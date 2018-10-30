/*---------------
2018.10.28
Aira Sakajiri
---------------*/
'use strict';

const question = [
    '問題1',
    '問題2',
    '問題3',
    '問題4',
    '問題5',
    '問題6',
]

const choices = [
    ['A','B','C'],
    ['D','E','F'],
    ['A','B','C'],
    ['D','E','F'],
    ['A','B','C'],
    ['D','E','F']
]

const answer = [0,0,0,0,0,0];

const MAX_QUIZ_NUMBER = question.length;
var currentQuizNum = 0;
var correctNum = 0;
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




var quiz = new Quiz();
console.log(quiz.answer);

$('#start').on('click',function(){
    quiz.setData(0);
    quiz.changeHtml();
});

$('[name=choice]').on('click',function(){
    if(quizFlag){
        alert(quiz.isAnswerCorrect($(this).val()));
        if(currentQuizNum<MAX_QUIZ_NUMBER-1){
            correctNum++;
            currentQuizNum++;
            quiz.setData(currentQuizNum);
            quiz.changeHtml();
        }else{
            alert(`Finish!\n正解率：${correctNum}`);
            quizFlag = false;
        }
    }
});



/*---------------
jQueryによるアニメーション
---------------*/





/*---------------
疑問点
- Classを宣言するとき、Quizは一つずつClass宣言したほうがいい？破棄したほうがいい？
- Classの宣言は別ファイルに分けるべき？


https://stackoverflow.com/questions/49895080/javascript-class-getter-setter
https://stackoverflow.com/questions/37502163/getter-setter-maximum-call-stack-size-exceeded-error
アロー構文
https://qiita.com/may88seiji/items/4a49c7c78b55d75d693b
---------------*/