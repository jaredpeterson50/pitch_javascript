/*TODO download svg files of deck and map each value to its cards

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
    //create a table and body element
    const tbl = document.createElement("table");
    const tbleBody = document.createElement("tbody");
    //loop for each player
    for(let i = 0; i < 4; i++){
        const row = document.createElement("tr");
        const title = document.createElement("td");
        const cellText = document.createTextNode("Player " + (i+1));
        title.appendChild(cellText);
        row.appendChild(title);
        //loop for each card of the player
        for(let j = 0; j < 6; j++){
            const tableData = document.createElement("td");
            const path = "img/" + players[i][j].suit + players[i][j].value + ".svg";
            const img = document.createElement("img");
            img.src=path;
            tableData.appendChild(img);
            //const text = document.createTextNode(players[i][j].value + " " + players[i][j].suit);
            //tableData.appendChild(text);
            row.appendChild(tableData);
        }
        tbleBody.appendChild(row);
    }
    tbl.appendChild(tbleBody);
    document.body.appendChild(tbl);
}