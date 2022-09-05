class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
        this.played = false;
    }
    toString() { return `(${this.value}${this.suit})`; } //can use this to compare cards
}

let x = {
    10:10,
    11:1,
    12:2,
    13:3,
    14:4,
    20:1, //joker
}
let arr = [];
let a = new Card("hearts", 11);
let b = new Card("hearts", 8);
let c = new Card("hearts", 12);
let d = new Card("hearts", 10);
let e = new Card("hearts", 13);
arr.push(a);
arr.push(b);
arr.push(c);
arr.push(d);
arr.push(e);
console.log(x[11]);
for(let i = 0 ; i < arr.length; i++){
    if(arr[i].value == x[10])
        console.log("got a 10 at index: " + i);
}
