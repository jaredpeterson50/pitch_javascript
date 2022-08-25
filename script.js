//toDo ... add logic for computer to bid 2 with a two and 3 with an ace.
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


//dealer order is 0=west 1=south 2=east 3=north
var dealerOrder = ['west', 'south', 'east', 'north']
var currentDealerIndex = 0; //west intit9al
var currentBidderIndex = 1; //south initial
var currentHighBid = 0;

function startGame(){
    createDeck();
    shuffle();
    deal();
    showCards();
    bid();
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
            newCard.classList.add(`player${i}`, 'cardPlayer', `p${i}c${j}`);
            document.body.appendChild(newCard);
            const pic = document.createElement("img");
            const path = "img/" + players[i][j].suit + players[i][j].value + ".svg";
            pic.src=path;
            newCard.appendChild(pic);
        }
    }
}
function bidBtn(bidAmt){
    switch(bidAmt){
        case '2':
            document.getElementById("southValue").innerText='2';
            document.getElementById("bidValue").innerText='2';
            currentBidderIndex++;
            bid();
            break;
        case '3':
            document.getElementById("southValue").innerText='3';
            document.getElementById("bidValue").innerText='3';
            currentBidderIndex++;
            bid();
            break;
        case '4':
            document.getElementById("southValue").innerText='4';
            document.getElementById("bidValue").innerText='4';
            currentBidderIndex++;
            bid();
            break;
        case '5':
            document.getElementById("southValue").innerText='5';
            document.getElementById("bidValue").innerText='5';
            currentBidderIndex++;
            bid();
            break;
        case '6':
            document.getElementById("southValue").innerText='6';
            document.getElementById("bidValue").innerText='6';
            currentBidderIndex++;
            bid();
            break;
        case 'pass':
            document.getElementById("southValue").innerText='pass';
            document.getElementById("bidValue").innerText='update';
            currentBidderIndex++;
            bid();
            break;
        default:
            console.log("error");
            break;
    }
    //setTimeout( () => {document.getElementById("score_good_guys").innerText="5";})
}

function bid(){

    //we want to loop 4 times to allow all players to bid every game. 
    // after the game, The dealer gits shifted right and first bidder

    //define a stop and start for user input. stop the game loop if its the users turn.
    //start the loop again after the user is don
    document.getElementById("dealerValue").innerText=dealerOrder[currentDealerIndex];
    document.getElementById("bidderValue").innerText=dealerOrder[currentBidderIndex];    
    while(currentDealerIndex+1 != currentBidderIndex){ //stopping condition is everyone has bid including dealer
        if(currentBidderIndex == 1){ //exit the loop if its south turn to click. then re enter function
            return;
        }
        else{
            //this is were the CPU logic exists
            //check if they have any aces.
            console.log("current bidder index: " + currentBidderIndex);
            console.log("dealerorder[currentBidderIndex]: " + dealerOrder[currentBidderIndex]);
            console.log("player cards");
            console.log(players[currentBidderIndex][0].value);
            console.log(players[currentBidderIndex][1].value);
        }
        currentBidderIndex = (currentBidderIndex + 1) % 4;
    }
//currentDealerIndex = (currentDealerIndex + 1) % 4; //after each game the dealer moves right
//currentBidderIndex = (currentDealerIndex + 1) % 4; //set the first bidder after each game
/*
    var game = {
        dealer:"west",
        bidder:"south",
        currentBid:"--",
        us:0,
        them:0
    }
    var south = {
        bidYet:false,
        bidAmt:'-',
        bidWon:'false'
    }
    var north = {
        bidYet:false,
        bidAmt:'-',
        bidWon:'false'
    }
    var east = {
        bidYet:false,
        bidAmt:'-',
        bidWon:'false'
    }
    var west = {
        bidYet:false,
        bidAmt:'-',
        bidWon:'false'
    }
    var south = {
        bidYet:false,
        bidAmt:'-',
        bidWon:'false'
    }
    */
}