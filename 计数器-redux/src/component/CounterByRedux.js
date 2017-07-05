import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// 获取元素
let $addCounter = $('.counterBox .addCounter'),
    $counterPanel = $('.counterBox .counterPanel'),
    $hasAll = $('.allSel .val'),
    $maximum = $('.maximum .val'),
    $allCount = $('.allCount .val');

let initState = [];

// 定义reducer
function counter(state = [], action) {
    let {type,id} = action;
    switch (type) {
        case 'ADD_COUNTER':
            return [...state, {
                    id: new Date().getTime(),
                    value: 0
                }]
        case 'INCREMENT':
            return state.map(e => {
                if(e.id === id){
                    e.value ++;
                }
                return e;
            })
        case 'DECREMENT':
            return state.map(e => {
                if(e.id === id){
                    e.value --;
                }
                return e;
            })
        default:
            return state;
    }
}

// 定义action
function increment(id){
    return {type:'INCREMENT',id};
}
function decrement(id){
    return {type:'DECREMENT',id};
}

// 定义thunk的函数
const addIfOff = (id,value) => (dispatch,getState) => {
    if(value % 2 === 0) return;
    dispatch(increment(id));
}
const addAsync = (id) => (dispatch,getState) =>{
    setTimeout(()=>{
        boundIncrement(id);
    },1000);
}

// 创建store
let store = createStore(counter,[],applyMiddleware(thunk));


// 创建dispatch
const boundIncrement = (id) => store.dispatch(increment(id));
const boundDecrement = (id) => store.dispatch(decrement(id));
const boundAddIfOdd = (id) => store.dispatch(addIfOff(id));
const boundAddAsync = (id) => store.dispatch(addAsync(id));






class Counter {
    constructor(store, data) {
        let {id,value} = data;
        this.value = value;
        this.counters = store;
        this.store = store;
        this.id = id;

        // 创建DOM元素
        this.elt = $('<div class="counter"></div>');
        
        let incrementBtn = this.incrementBtn = $('<button class="add"></button>');
        let decrementBtn = this.decrementBtn = $('<button class="sub"></button>');
        let oddBtn = this.oddBtn = $('<button class="addIfOdd"></button>');
        let asyncBtn = this.asyncBtn = $('<button class="addAsync"></button>');
        let num = this.num = $(`<span>${this.value}</span>`);

        this.elt.append(decrementBtn, num, incrementBtn, oddBtn, asyncBtn);

        incrementBtn.click(this.increment.bind(this));
        decrementBtn.click(this.decrement.bind(this));
        oddBtn.click(this.addIfOdd.bind(this));
        asyncBtn.click(this.addAsync.bind(this));

    }
    decrement() {
        if (this.value === 0) return;
        const {id} = this;
        this.store.dispatch({type: 'DECREMENT',id});
    }
    increment() {
        const {id} = this;
        this.store.dispatch({type: 'INCREMENT',id});
    }
    addIfOdd() {
        boundAddIfOdd(this.id,this.value);
    }
    addAsync() {
        boundAddAsync(this.id);
    }
}

// 添加
$addCounter.click(ev => {
    store.dispatch({type: 'ADD_COUNTER'});
});

// 发起action的时候更新View

store.subscribe(() => {
    let state = store.getState();
    $counterPanel.html("");
    state.forEach(data => {
        $counterPanel.append(new Counter(store,data).elt);
    });
    $hasAll.html(state.every(e => e.value !== 0) + '');
    $maximum.html([...state].sort((a,b) => b.value-a.value)[0].value);
    $allCount.html(state.reduce((accu, e) => accu+e.value,0));
})