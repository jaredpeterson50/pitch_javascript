/*
    CSS transforms... rotate and translate
    
*/

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
let players = [[],[],[],[]]; //all 4 player in the players array
let team1 = 0;
let team2 = 0;

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
    //players 1,2,3,4
    for(let i = 0; i < 4; i++){
        //cards 1,2,3,4,5,6
        for(let j = 0; j < 6; j++){
            players[i].push(deck.pop());
        }
    }
}
function showCards(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 6; j++){
            const newCard = document.createElement("div");
            newCard.classList.add(`player${i+1}`, 'cardPlayer', `p${i+1}c${j+1}`);
            document.body.appendChild(newCard);
            const pic = document.createElement("img");
            const path = "img/" + players[i][j].suit + players[i][j].value + ".svg";
            pic.src=path;
            newCard.appendChild(pic);
        }
    }
}

