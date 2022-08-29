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
var delay = 300;
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

function chooseSuit(){
    document.getElementById("biddingTable").classList.add("hidden"); //hide biddingTable
    if(winningBidder === 'south')//check if user won bid or computer
        document.getElementById("playerSuitSelection").classList.remove("hidden"); //show playerSuitSelection
    else{
        let node = document.getElementById("computerWonBid");
        node.innerText = `${winningBidder} won the bid in  ${winningSuit} with a bid of ${currentHighBid}`;
        document.getElementById("trumpSuit").innerText= `${winningSuit}`;
        document.getElementById("computerWonBid").classList.remove("hidden") //show computer won bid and discard
        document.getElementById("discard").classList.remove("hidden");
        discardLogic();
    }    
}
//called from the suit buttons onclick event
function suiteSelection(userSuit){
    document.getElementById("playerSuitSelection").classList.add("hidden");
    document.getElementById("discard").classList.remove("hidden");
    winningSuit = userSuit;
    document.getElementById("trumpSuit").innerText= `${winningSuit}`;
    discardLogic();
}

function discardLogic(){
    //we need to know if player is offense or defense
    //we want to keep all trump, offjack, joker for every player
    //player 0 and 2 are on a team. player 1 and 3 are on a team with p1 =user
    //dont throw out off or bug joker value =20
    //identify off jack
    var offJack;
    if(winningSuit === 'hearts')
        offJack = new Card("diamonds",11);
    if(winningSuit === 'diamonds')
        offJack = new Card("hearts",11);
    if(winningSuit === 'clubs')
        offJack = new Card("spades",11);
    if(winningSuit === 'spades')
        offJack = new Card("clubs",11);

    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].addEventListener('click', () => {
            player1Cards[i].classList.add("translateY");
            let temp = deck.pop();
            players[1][i] = temp;// ex p1c2  leter 1 is 1 letter 3 is 2
        });
    }

    for(let i = 0; i < players[0].length; i++){
        if(players[0][i].value == 20)
            continue;
        if(players[0][i].value == 20 || players[0][i] == offJack)
            continue;
        if(players[0][i].suit !== winningSuit){
            let temp = deck.pop();
            players[0][i] = temp;// ex p1c2  leter 1 is 1 letter 3 is 2
        }
    }
    for(let i = 0; i < players[2].length; i++){
        if(players[2][i].value == 20)
            continue;
        if((players[2][i].suit === offJack.suit) && (players[2][i].value === offJack.value))
            continue;
        if(players[2][i].suit !== winningSuit){
            console.log(players[3][i] + " card");
            let temp = deck.pop();
            players[2][i] = temp;// ex p1c2  leter 1 is 1 letter 3 is 2
        }
    }   
    for(let i = 0; i < players[3].length; i++){
        if(players[3][i].value == 20)
            continue;
        if((players[3][i].suit === offJack.suit) && (players[3][i].value === offJack.value)){
            continue;
        }
        if(players[3][i].suit !== winningSuit){
            let temp = deck.pop();
            players[3][i] = temp;// ex p1c2  leter 1 is 1 letter 3 is 2
        }
    }
}

function reDeal(){
    //every card has class cardPlayer, querry them and remove them all
    let test = document.querySelectorAll('.cardPlayer');
    for(let i = 0; i < test.length; i++){
        test[i].remove();
    }
    sortBySuit();
    showCards();
    document.getElementById("discard").classList.add("hidden");
    document.getElementById("computerWonBid").classList.add("hidden");
    playHand();
}

function playHand(){
    //first to lead is the bidder or winner of last hand
    //lets start with computer
    console.log("first to bid: " + winningBidder);
    //add click event handler transform y -40%
    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].addEventListener('click', () => {
            player1Cards[i].classList.add("translatep1Play");
        });
    }
    let player0Cards = document.querySelectorAll(".player0");
    for(let i = 0; i < player0Cards.length; i++){
        player0Cards[i].addEventListener('click', () => {
            player0Cards[i].classList.add("translatep0Play");
        });
    }
    let player2Cards = document.querySelectorAll(".player2");
    for(let i = 0; i < player2Cards.length; i++){
        player2Cards[i].addEventListener('click', () => {
            player2Cards[i].classList.add("translatep2Play");
        });
    }
    let player3Cards = document.querySelectorAll(".player3");
    for(let i = 0; i < player3Cards.length; i++){
        player3Cards[i].addEventListener('click', () => {
            player3Cards[i].classList.add("translatep3Play");
        });
    }
}