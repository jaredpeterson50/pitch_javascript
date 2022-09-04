class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
    }
}

class Game{
    constructor(){
        this.p0Cards = [];
        this.p1Cards = [];
        this.p2Cards = [];
        this.p3Cards = [];
    }
}

//card deck
let suits = ["clubs","spades","diamonds","hearts"];
let values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
let deck = [];

//hide all of the prompts until later in the game when needed
document.getElementById("gameEnd").classList.add("hidden");
document.getElementById("playerSuitSelection").classList.add("hidden"); //make suit selection hidden default
document.getElementById("discard").classList.add("hidden");
document.getElementById("computerWonBid").classList.add("hidden");

//gameplay variables
let game = new Game();
var dealerOrder = ['west', 'south', 'east', 'north']
var currentDealerIndex = 0; //west intitial
var currentBidderIndex = 1; //south initial
document.getElementById("dealerValue").innerText=dealerOrder[currentDealerIndex]; //display dealer
var currentHighBid = 0;
var trumpSuit ="";
var winningBidder = "";
var timer = ms => new Promise(res => setTimeout(res, ms))
var delay = 1000;
var playerBidAmounts = [0,0,0,0];
var bidCounter=0;
var discards = [];
var p0Trick = [];
var p1Trick = [];
var p2Trick = [];
var p3Trick = [];
//trick and determine winner variables
var totalHandsPlayed = 0;
var playHandCounter = 0;
var indexStartingPlayer = 1;
var handsPlayed = 0;
var offJack;
var trick = [];

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
//deal p2 cards backwards so they show value better
function deal(){
    //players 1,2,3,4
    for(let i = 0; i < 4; i++){
        //cards 1,2,3,4,5,6
        for(let j = 0; j < 6; j++){
            let card = deck.pop();
            let arrayName = `p${i}Cards`;
            game[arrayName].push(card);
        }
    }
}
//need to sort largest to smallest as well
function sortBySuit(){
    let sorted = []
    let suits = ["clubs","spades","diamonds","hearts", "joker"];// dont forget the joker
    for(let k = 0; k < 4; k++){ 
        for(let i = 0; i < suits.length; i++){ 
            for(let j = 0; j < game[`p${k}Cards`].length; j++){ 
                if(game[`p${k}Cards`][j].suit == suits[i]){
                    sorted.push(game[`p${k}Cards`][j]);
                }
            }
        }
        //do a sort from highest to smallest
        let changed = true;
        while(changed){
            changed=false;
            for(let i = 0; i < sorted.length-1; i++){
                if((sorted[i].suit == sorted[i+1].suit) && (sorted[i].value < sorted[i+1].value)){
                    let temp = sorted[i];
                    sorted[i] = sorted[i+1];
                    sorted[i+1] = temp;
                    changed=true;
                }
            }
        }
        game[`p${k}Cards`] = sorted;
        sorted=[]; //emtpty it for the next loop
    }
}
   
function showCards(){
    for(let i = 0; i < 4; i++){
        //if(i == 2) //we need to deal p2 backwards so you can see the numbers on the upper right
        //    continue;
        for(let j = 0; j < 6; j++){
            const newCard = document.createElement("div");
            //for each card we adding 3 classes. ex player0, cardPlayer, p0c1
            newCard.classList.add(`player${i}`, 'cardPlayer', `p${i}c${j}`);
            document.body.appendChild(newCard);
            const pic = document.createElement("img");
            const path = "img/" + game[`p${i}Cards`][j].suit + game[`p${i}Cards`][j].value + ".svg";
            pic.src=path;
            newCard.appendChild(pic);
        }
    }
    //deal player2 backwards so the card pictures you can read the value
    /*
    let i = 2;
    for(let j = 5; j >=0; j--){
        const newCard = document.createElement("div");
        //for each card we adding 3 classes. ex player0, cardPlayer, p0c1
        newCard.classList.add(`player${i}`, 'cardPlayer', `p${i}c${j}`);
        document.body.appendChild(newCard);
        const pic = document.createElement("img");
        const path = "img/" + game[`p${i}Cards`][j].suit + game[`p${i}Cards`][j].value + ".svg";
        pic.src=path;
        newCard.appendChild(pic);
    }
    */
}

function bidBtnHelper(bidAmount){
    document.getElementById("southValue").innerText=bidAmount;
    document.getElementById("bidValue").innerText=bidAmount;
    currentHighBid=Number.parseInt(bidAmount);
    winningBidder=dealerOrder[currentBidderIndex];
}

function userBid(bidAmt){
    playerBidAmounts[1] = bidAmt;
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
    //bidder should only update when there is a new high bidder
    //document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex]; //display bidder

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
                trumpSuit=bidObj.suit;
                winningBidder=dealerOrder[currentBidderIndex];
                indexStartingPlayer=currentBidderIndex; //default is set for player1, else set here
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex]; //display bidder
            }
            //below populated bid table with each players bid
            document.getElementById(`${dealerOrder[currentBidderIndex]}Value`).innerText=bidObj.bid;
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
        if(game[`p${currentBidderIndex}Cards`][i].value==14) //we have an ace what suite? hears lets say
            suitBidAmount[suits.indexOf(game[`p${currentBidderIndex}Cards`][i].suit)] += 2; 
        if(game[`p${currentBidderIndex}Cards`][i].value==2) // we have a low
            suitBidAmount[suits.indexOf(game[`p${currentBidderIndex}Cards`][i].suit)] += 1.1;
        if(game[`p${currentBidderIndex}Cards`][i].value==20){// we have a joker every suite .5 add
            for(let j = 0; j < 4; j++)
                suitBidAmount[j] += .5;
        }
        if(game[`p${currentBidderIndex}Cards`][i].value==11){ //jack add .5 to both trump and off suite 0,1 or ,2,3
            suitBidAmount[suits.indexOf(game[`p${currentBidderIndex}Cards`][i].suit)] += .5;   
        }
        if(game[`p${currentBidderIndex}Cards`][i].value==12){ //queen add .25
            suitBidAmount[suits.indexOf(game[`p${currentBidderIndex}Cards`][i].suit)] += .25; 
        }
        if(game[`p${currentBidderIndex}Cards`][i].value==13){ //king add .25
            suitBidAmount[suits.indexOf(game[`p${currentBidderIndex}Cards`][i].suit)] += .25; 
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
        node.innerText = `${winningBidder} won the bid in  ${trumpSuit} with a bid of ${currentHighBid}`;
        document.getElementById("trumpSuit").innerText= `${trumpSuit}`;
        document.getElementById("computerWonBid").classList.remove("hidden") //show computer won bid and discard
        document.getElementById("discard").classList.remove("hidden");
        discardLogic();
    }    
}
//called from the suit buttons onclick event
function suiteSelection(userSuit){
    document.getElementById("playerSuitSelection").classList.add("hidden");
    document.getElementById("discard").classList.remove("hidden");
    trumpSuit = userSuit;
    document.getElementById("trumpSuit").innerText= `${trumpSuit}`;
    
    discardLogic();
}

function discardLogic(){
    //we need to know if player is offense or defense
    //we want to keep all trump, offjack, joker for every player
    //player 0 and 2 are on a team. player 1 and 3 are on a team with p1 =user
    //dont throw out off or bug joker value =20
    //identify off jack
    
    if(trumpSuit === 'hearts')
        offJack = new Card("diamonds",11);
    if(trumpSuit === 'diamonds')
        offJack = new Card("hearts",11);
    if(trumpSuit === 'clubs')
        offJack = new Card("spades",11);
    if(trumpSuit === 'spades')
        offJack = new Card("clubs",11);

    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].addEventListener('click', () => {
            player1Cards[i].classList.add("translateY");
            let temp = deck.pop();
            game.p1Cards[i] = temp;
        });
    }
    for(let j = 0; j < 4; j++){ //4 players total
        if(j ==1) //dont automate player 1 discard
            continue;
        for(let i = 0; i < game[`p${j}Cards`].length; i++){
            if(game[`p${j}Cards`][i].value == 20)
                continue;
            if((game[`p${j}Cards`][i].suit == offJack.suit) && (game[`p${j}Cards`][i].value == offJack.value))
                continue;
            if(game[`p${j}Cards`][i].suit !== trumpSuit){
                let temp = deck.pop();
                game[`p${j}Cards`][i] = temp;
            }
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
    userPlayHand();
    playHand();
}
function userPlayHand(){    
    player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].addEventListener('click', async () => {
            player1Cards[i].classList.add("translatep1Play");
            let obj = {
                card:game.p1Cards[i],
                node:player1Cards[i]
            }
            trick.push(obj);
            indexStartingPlayer++;
            playHandCounter++
            await timer(delay);
            playHand();
        });
    }
}
async function playHand(){
    let nodeCards = { //make it an object so we can use string interpolation to access the values
        player0Cards: document.querySelectorAll(".player0"),
        player1Cards: document.querySelectorAll(".player1"),
        player2Cards: document.querySelectorAll(".player2"),
        player3Cards: document.querySelectorAll(".player3"),
    }
    while(totalHandsPlayed < 6){
        while(playHandCounter < 4){
            if(indexStartingPlayer == 1) //the user will decide what to play
                return;
            //we need to add logic as to what cards to play
            nodeCards[`player${indexStartingPlayer}Cards`][totalHandsPlayed].classList.add(`translatep${indexStartingPlayer}Play`);
            let obj = {
                card:game[`p${indexStartingPlayer}Cards`][totalHandsPlayed],
                node:nodeCards[`player${indexStartingPlayer}Cards`][totalHandsPlayed]
            }
            trick.push(obj);
            playHandCounter++
            indexStartingPlayer++;
            if(indexStartingPlayer == 4) //for some reason when i did indexstatingpalyer %4 it was inconsistent
                indexStartingPlayer=0;
            await timer(delay);
        }
        playHandCounter = 0;
        console.log("sending determine trick winner");
        indexStartingPlayer = determineTrickWinner(trick);    
        console.log("returned from trickwinner");
        totalHandsPlayed++;
    }
}
//!!!!!!!!!!!!dont foget off jack and joker for trump
function determineTrickWinner(trick){    
    let leadSuit;
    let currentLeader;
    let currentHighCard = "";
    let suit;
    //we need to start current suit. we find the largest current suit unless someone trumps in
    //we will push the array to whatever player won the trick. we need to id the first to play
    console.log("inside determine trick winner");
    for(let i = 0; i < trick.length; i++){
        console.log(" player#: " + trick[i].node.classList[0]);
        let player = trick[i].node.classList[0][6];
        let value = trick[i].card.value;
        console.log("checking for off jack and joker")
        console.log(trick[i].card);
        console.log(offJack);
        console.log(trick[i].card.value == offJack.value && trick[i].card.suit == offJack.suit)
        console.log(trick[i].card.value == 20)
        if(trick[i].card.value == offJack.value && trick[i].card.suit == offJack.suit){
            suit = trumpSuit
            value=10.9; //a little weaker than boss jack
        }
        else if(trick[i].card.value == 20){
            suit = trumpSuit
            value=10.8;
        }
        else
            suit = trick[i].card.suit;
        if(currentLeader == null){
            console.log("first run");
            currentLeader=player;
            currentHighCard=value;
            leadSuit=trick[i].card.suit;
            continue;
        }
        //now lets check if the next guy followed suit
        if(suit == leadSuit){
            console.log("same suit");
            if(value > currentHighCard){
                currentLeader=player;
                currentHighCard=value;
            }
        }
        else if(suit == trumpSuit){ //trumping in
            console.log("trumping in");
            console.log("player: " + player);
            currentLeader=player;
            currentHighCard=value;
            leadSuit = suit;
        }
    }
    console.log("current high card: " + currentHighCard);
    console.log("suit that won it: " + leadSuit);
    console.log("player that won the trick: " + currentLeader);
    if(currentLeader == 0){
        for(let i = 0; i < trick.length; i++){
            trick[i].node.classList.add("trick0");
            console.log("adding trick0 to every card in play");
        }
        p0Trick.push(trick);
    }
    if(currentLeader == 1){
        for(let i = 0; i < trick.length; i++)
            trick[i].node.classList.add("trick1");
        p1Trick.push(trick); 
    }
          
    if(currentLeader == 2){
        for(let i = 0; i < trick.length; i++)
            trick[i].node.classList.add("trick2");
        p2Trick.push(trick); 
    }  
    if(currentLeader == 3){
        for(let i = 0; i < trick.length; i++)
            trick[i].node.classList.add("trick3");
        p3Trick.push(trick); 
    }

    handsPlayed++;
    console.log("hands played: " + handsPlayed);
    if(handsPlayed == 6)
        tallyGamePoints();
    else
        return currentLeader;
}

function tallyGamePoints(){
    document.getElementById("gameEnd").classList.remove("hidden");
    //first we can tally gew
    console.log(p0Trick);
    console.log(p1Trick);
    console.log(p2Trick);
    console.log(p3Trick);
    
}