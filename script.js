/*TODO  I have createDeck,shuffle,deal functions working.  Next step
is to make a quick war game and try to keep the score of it. Need to display cards in CSS.

*/

//make a table displaying each players respective cards

class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
    }
}

//card deck
let suits = ["clubs","spades","diamonds","hearts"];
let values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
let deck = [];
let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let team1 = 0;
let team2 = 0;

//createDeck();
//shuffle();
//deal();
function startGame(){
    createDeck();
    shuffle();
    deal();
}

//create a deck start with the joker then add the rest with loops from suits and values array
function createDeck(){
    var joker = new Card("joker",20);
    deck.push(joker);
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < values.length; j++){
            var newCard = new Card(suits[i],values[j]);
            deck.push(newCard);
        }
    }
}

//shuffle function, there are 53 cards so we will multiply the float
// that is between 0(inclusive)-1(not inclusive) this will make the max value 52 which work for 0-52 index
function shuffle(){
    for(let i = 0; i < 1000; i++){
        let pos1 = Math.floor(Math.random()*53);
        let pos2 = Math.floor(Math.random()*53);
        let temp = deck[pos1];
        deck[pos1] = deck[pos2];
        deck[pos2] = temp;
    }
}

//deal each player 6 cards 3 at a time so run the loop twice, call the deal3Helper twice
function deal(){
    for(let i = 0; i < 2; i++){
        player1.push(deck.pop());
        player1.push(deck.pop());
        player1.push(deck.pop());
        player2.push(deck.pop());
        player2.push(deck.pop());
        player2.push(deck.pop());
        player3.push(deck.pop());
        player3.push(deck.pop());
        player3.push(deck.pop());
        player4.push(deck.pop());
        player4.push(deck.pop());
        player4.push(deck.pop());
    }
    console.log("dealt");
}
function showCards(){
    let x = player1[0].suit + " " + player1[0].value;
    document.getElementById("p1c1").textContent = x;
    console.log(x);
}

function generate_table() {
    // creates a <table> element and a <tbody> element
     const tbl = document.createElement("table");
     const tblBody = document.createElement("tbody");
   
     // creating all cells
     for (let i = 0; i < 2; i++) {
       // creates a table row
       const row = document.createElement("tr");
   
       for (let j = 0; j < 2; j++) {
         // Create a <td> element and a text node, make the text
         // node the contents of the <td>, and put the <td> at
         // the end of the table row
         const cell = document.createElement("td");
         const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
         cell.appendChild(cellText);
         row.appendChild(cell);
       }
   
       // add the row to the end of the table body
       tblBody.appendChild(row);
     }
   
     // put the <tbody> in the <table>
     tbl.appendChild(tblBody);
     // appends <table> into <body>
     document.body.appendChild(tbl);
     // sets the border attribute of tbl to '2'
     tbl.setAttribute("border", "2");
   }
   


console.log(player1);
console.log(player2);
console.log(player3);
console.log(player4);
