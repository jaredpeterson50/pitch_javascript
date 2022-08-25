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

//gameplay variables
//dealer order is 0=west 1=south 2=east 3=north
var dealerOrder = ['west', 'south', 'east', 'north']
var currentDealerIndex = 0; //west intitial
var currentBidderIndex = 1; //south initial
var currentHighBid = 0;

function startGame(){
    createDeck();
    shuffle();
    deal();
    sortBySuite();
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

function sortBySuite(){
    let suits = ["clubs","spades","diamonds","hearts", "joker"]; //added a joker suite
    //loop through each player
    for(let k = 0; k < 4; k++){
        let sortedArray = [];
        //loop for each suite
        for(let j = 0; j < suits.length; j++){
            //loop through each card in their hand
            for(let i = 0; i < 6; i++){
                if(players[k][i].suit == suits[j]){ //dont forget about suit joker
                    let tempCard = players[k][i];
                    sortedArray.push(tempCard);
                }
            }
        }
        players[k] = sortedArray; //replace each players array with a sorted array
    }
}

function showCards(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 6; j++){
            const newCard = document.createElement("div");
            //for each card we adding 3 classes. ex player0, cardPlayer, p0c1
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
}

/* starts by displaying dealer and bidder on top left. in while loop we are checking our stopping conditon
if current bidder and dealer+1 are the same then exit the loop everyone bid alread. if condition is to exit
the loop if its the human players turn. after the onlick event executes it will return to the bid function
and loop will continue. the CPU logic will refenernce a logic function for pitch bidding strategy */
function bid(){
    document.getElementById("dealerValue").innerText=dealerOrder[currentDealerIndex];
    document.getElementById("bidderValue").innerText=dealerOrder[currentBidderIndex];    
    while(currentDealerIndex+1 != currentBidderIndex){ //stopping condition is everyone has bid including dealer
        if(currentBidderIndex == 1){ //exit the loop if its south turn to click. then re enter function
            return;
        }
        else{
            const bidAmount = bidLogic();
            document.getElementById(`${dealerOrder[currentBidderIndex]}Value`).innerText=bidAmount;
        }
        currentBidderIndex = (currentBidderIndex + 1) % 4;
    }
    
//currentDealerIndex = (currentDealerIndex + 1) % 4; //after each game the dealer moves right
//currentBidderIndex = (currentDealerIndex + 1) % 4; //set the first bidder after each game
}
function bidLogic(){
    let bidAmount = 0;
    let suiteBidAmount = [0,0,0,0]; //init to zero each value
    console.log("current bidder index: " + currentBidderIndex);
    console.log("dealerorder[currentBidderIndex]: " + dealerOrder[currentBidderIndex]);
    console.log("player cards");
    console.log(players[currentBidderIndex][0].value);
    console.log(players[currentBidderIndex][1].value);
    //console.log("index of hearts: " + suits.indexOf(players[currentBidderIndex][i].suit));
    //each rule will loop like this let first check for Aces dynamic programming we dont need 3 loops
    //each suite
    for(let i = 0; i < 6; i++){
        if(players[currentBidderIndex][i].value==14) //we have an ace what suite? hears lets say
            suiteBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += 2;
        if(players[currentBidderIndex][i].value==2) // we have a low
            suiteBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += 1.1;
        if(players[currentBidderIndex][i].value==20){// we have a joker every suite .5 add
            for(let j = 0; j < 4; j++)
                suiteBidAmount[j] += .5;
        }
        if(players[currentBidderIndex][i].value==11){ //jack add .5 to both trump and off suite 0,1 or ,2,3
            suiteBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .5;   
        }
        if(players[currentBidderIndex][i].value==12){ //queen add .25
            suiteBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .25; 
        }
        if(players[currentBidderIndex][i].value==13){ //king add .25
            suiteBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .25; 
        }      

    }
    console.log("suite bid amount: " + suiteBidAmount);
    //take the ceiling of the largest number in the array
    bidAmount= Math.max.apply(Math, suiteBidAmount);
    bidAmount = Math.ceil(bidAmount);
    console.log("going to bid:" + bidAmount);
    if(currentHighBid < bidAmount){
        currentHighBid = bidAmount
        return bidAmount;
    }
    else{
        return "pass"
    }
}