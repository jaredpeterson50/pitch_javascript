class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
    }
}

class Player{
    constructor(){
        this.bid=0;
        this.bidSuit="";
        this.offense=true; //false if east or west wins bid
    }
}

class Gameplay{
    constructor(){
        highBid = 0;
        eastWest = 0;
        northSouth = 0;
    }
}

var p0 = new Player();
var p1 = new Player();
var p2 = new Player();
var p3 = new Player();

//card deck
let suits = ["clubs","spades","diamonds","hearts"];
let values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
let deck = [];
let players = [[],[],[],[]]; //holds the players cards west,south,east,north


//gameplay variables
//dealer order is 0=west 1=south 2=east 3=north
document.getElementById("playerSuitSelection").classList.add("hidden"); //make suit selection hidden default
document.getElementById("discard").classList.add("hidden");
document.getElementById("computerWonBid").classList.add("hidden");
var dealerOrder = ['west', 'south', 'east', 'north']
var currentDealerIndex = 0; //west intitial
var currentBidderIndex = 1; //south initial
var currentHighBid = 0;
var winningSuit ="";
var winningBidder = "";
var timer = ms => new Promise(res => setTimeout(res, ms))
var delay = 1000;
var playerBidAmounts = [0,0,0,0];
var bidCounter=0;
var discards = [];

function startGame(){
    createDeck();
    shuffle();
    deal();
    sortBySuit();
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

function sortBySuit(){
    let suits = ["clubs","spades","diamonds","hearts", "joker"]; //added a joker suit
    //loop through each player
    for(let k = 0; k < 4; k++){
        let sortedArray = [];
        //loop for each suit
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

function bidBtnHelper(bidAmount){
    document.getElementById("southValue").innerText=bidAmount;
    document.getElementById("bidValue").innerText=bidAmount;
    currentHighBid=Number.parseInt(bidAmount);
    winningBidder=dealerOrder[currentBidderIndex];
}
function userBid(bidAmt){
    playerBidAmounts[1] = bidAmt;
    console.log("userbidAmount: " + bidAmt);
    switch(bidAmt){
        case '2':
            if(currentHighBid < 2){
                bidBtnHelper(bidAmt);
            }
            currentBidderIndex++;
            bid();
            break;
        case '3':
            if(currentHighBid < 3){
                bidBtnHelper(bidAmt);
            }
            currentBidderIndex++;
            bid();
            break;
        case '4':
            if(currentHighBid < 4){
                bidBtnHelper(bidAmt);
            }
            currentBidderIndex++;
            bid();
            break;
        case '5':
            if(currentHighBid < 5){
                bidBtnHelper(bidAmt);
            }
            currentBidderIndex++;
            bid();
            break;
        case '6':
            if(currentHighBid < 6){
                bidBtnHelper(bidAmt);
            }
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


async function bid(){
    document.getElementById("dealerValue").innerText=dealerOrder[currentDealerIndex]; //display dealer
    document.getElementById("bidderValue").innerText=dealerOrder[currentBidderIndex]; //display bidder

    while(bidCounter < 4){
        bidCounter++;
        if(currentBidderIndex === 1){  //exit the loop if its the users turn to bid. then re enter function
            await timer(delay);
            return;
        }
        else{
            const bidObj = bidLogic(); //computer decides what to bid
            if(bidObj.bid > currentHighBid){
                currentHighBid = bidObj.bid;
                console.log("updating current high bid: " + currentHighBid);
                winningSuit=bidObj.suit;
                winningBidder=dealerOrder[currentBidderIndex];
            }
            document.getElementById(`${dealerOrder[currentBidderIndex]}Value`).innerText=bidObj.bid;
            document.getElementById("bidderValue").innerText=dealerOrder[currentBidderIndex]; 
            document.getElementById("bidValue").innerText=currentHighBid;
        }
        await timer(delay);
        currentBidderIndex = (currentBidderIndex + 1) % 4;
    }
   chooseSuit();
}

function bidLogic(){
    let bidAmount = 0;
    let suitBidAmount = [0,0,0,0]; //init to zero each value
    //go thru each card putting values of points into the suitBidAmount array
    for(let i = 0; i < 6; i++){
        if(players[currentBidderIndex][i].value==14) //we have an ace what suite? hears lets say
            suitBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += 2;
        if(players[currentBidderIndex][i].value==2) // we have a low
            suitBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += 1.1;
        if(players[currentBidderIndex][i].value==20){// we have a joker every suite .5 add
            for(let j = 0; j < 4; j++)
                suitBidAmount[j] += .5;
        }
        if(players[currentBidderIndex][i].value==11){ //jack add .5 to both trump and off suite 0,1 or ,2,3
            suitBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .5;   
        }
        if(players[currentBidderIndex][i].value==12){ //queen add .25
            suitBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .25; 
        }
        if(players[currentBidderIndex][i].value==13){ //king add .25
            suitBidAmount[suits.indexOf(players[currentBidderIndex][i].suit)] += .25; 
        }      
    }
    console.log("bid counter: " + bidCounter);
    bidAmount= Math.max.apply(Math, suitBidAmount);
    let roundedBidAmount = Math.ceil(bidAmount); //take the ceiling of the largest number in the array to bid
    if(currentHighBid >= roundedBidAmount || roundedBidAmount < 2)//not a new high bidder or dont have a 2 bid
        roundedBidAmount="pass";
    if(currentHighBid < 2 && bidCounter == 3) //if your the last bidder you need to bid 2 and dont over bid
        roundedBidAmount=2;
    const retVal = {
        bid: roundedBidAmount,
        suit: suits[suitBidAmount.indexOf(bidAmount)]
    }
    return retVal;
}

//if winningBidder=== "south") display window or buttons
function chooseSuit(userSuit){
    document.getElementById("biddingTable").classList.add("hidden");
    document.getElementById("discard").classList.remove("hidden");
    //allow the user to discard
    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].addEventListener('click', () => {
            player1Cards[i].classList.add("translateY");
            discards.push(player1Cards[i].classList[2].toString());
        });
    }
    //check if user won bid or computer
    if(winningBidder === 'south'){
        winningSuit = userSuit;
        document.getElementById("trumpSuit").innerText= `${winningSuit}`;
        document.getElementById("playerSuitSelection").classList.remove("hidden");
    }
    else{
        let node = document.getElementById("computerWonBid");
        node.innerText = `${winningBidder} won the bid in  ${winningSuit} with a bid of ${currentHighBid}`;
        document.getElementById("trumpSuit").innerText= `${winningSuit}`;
        document.getElementById("computerWonBid").classList.remove("hidden")
        discardLogic();
    }    
}
function discardLogic(){
    console.log("computer discard logic");
    let player0Cards = document.querySelectorAll(".player");
    for(let i = 0; i < player0Cards.length; i++){
        console.log(player0Cards.length);
    }
}

function reDeal(){
    console.log(discards);
    console.log(players[discards[0][1]][discards[0][3]]);
    for(let i = 0; i < discards.length; i++){
        //locate the card in players array, create a new card deck.pop(). re render the cards
        //delete the element div then launch showCards()
        let temp = deck.pop();
        players[discards[i][1]][discards[i][3]] = temp;// ex p1c2  leter 1 is 1 letter 3 is 2
    }
    //every card has class cardPlayer, querry them and remove them all
    let test = document.querySelectorAll('.cardPlayer');
    for(let i = 0; i < test.length; i++){
        test[i].remove();
    }
    //re run show cards with new cards removing discards
    showCards();
}