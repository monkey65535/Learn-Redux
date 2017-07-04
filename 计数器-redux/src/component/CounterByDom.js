// 获取元素
let $addCounter = $('.counterBox .addCounter'),
    $counterPanel = $('.counterBox .counterPanel'),
    $hasAll = $('.allSel .val'),
    $maximum = $('.maximum .val'),
    $allCount = $('.allCount .val');

const counters = [];

class Counter{
    constructor(counters){
        this.value = 0;
        this.counters = counters;
        this.elt = $('<div class="counter"></div>');
        // 创建DOM元素
        let incrementBtn = this.incrementBtn = $('<button class="add"></button>');
        let decrementBtn = this.decrementBtn = $('<button class="sub"></button>');
        let oddBtn = this.oddBtn = $('<button class="addIfOdd"></button>');
        let asyncBtn = this.asyncBtn = $('<button class="addAsync"></button>');
        let num = this.num = $(`<span>${this.value}</span>`);

        this.elt.append(decrementBtn,num,incrementBtn,oddBtn,asyncBtn);
        
        incrementBtn.click(this.increment.bind(this));
        decrementBtn.click(this.decrement.bind(this));
        oddBtn.click(this.addIfOdd.bind(this));
        asyncBtn.click(this.addAsync.bind(this));

    }
    decrement(){
        if(this.value === 0) return;
        this.num.text(--this.value);
        syncState(this.counters);
    }
    increment(){
        this.num.text(++this.value);
        syncState(this.counters);
    }
    addIfOdd(){
        if(this.value % 2 === 0) return;
        this.num.text(++this.value);
        syncState(this.counters);
    }
    addAsync(){
        setTimeout(()=>{
            this.num.text(++this.value);
            syncState(this.counters);
        },1000);
    }
}

$addCounter.click(ev =>{
    let counter = new Counter(counters);
    counters.push(counter);
    $counterPanel.append(counter.elt);
});
$

function checkHasAll(counters){
    let val = counters.every(e => e.value !== 0);
    console.log(val);
    $hasAll.text(val + '');
}

function calcMax(counters){
    let val = counters.slice().sort((a,b) => b.value - a.value)[0];
    console.log(val);
    $maximum.text(val);
}

function countAll(counters){
    let val = counters.reduce((accu,elt) => accu + elt.value);
    console.log(val);
    $allCount.text(val);
}

function syncState(counters){
    checkHasAll(counters);
    calcMax(counters);
    countAll(counters);
}