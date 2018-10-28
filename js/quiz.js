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
疑問点
- Classを宣言するとき、Quizは一つずつClass宣言したほうがいい？破棄したほうがいい？
- Classの宣言は別ファイルに分けるべき？


https://stackoverflow.com/questions/49895080/javascript-class-getter-setter
https://stackoverflow.com/questions/37502163/getter-setter-maximum-call-stack-size-exceeded-error
アロー構文
https://qiita.com/may88seiji/items/4a49c7c78b55d75d693b
---------------*/