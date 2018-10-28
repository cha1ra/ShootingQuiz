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