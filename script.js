//we should make it so we have class variables that get wiped each hand and others that persist to the end of the game
class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
        this.played = false;
    }
    toString() { return `(${this.value}${this.suit})`; } //can use this to compare cards
}

class Game{
    constructor(){
        this.suits = ["clubs","spades","diamonds","hearts"];
        this.values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.usScore = 0;
        this.themScore = 0;
        this.dealerOrder = ['west', 'south', 'east', 'north']
        this.currentDealerIndex = 0; //west intitial
        this.currentBidderIndex = 1; //south initial
        // move these to hand remove these in a minute
        this.p0Cards = [];
        this.p1Cards = [];
        this.p2Cards = [];
        this.p3Cards = [];
    }
}

class Hand{
    constructor(){
        this.p0Trick = [];
        this.p1Trick = [];
        this.p2Trick = [];
        this.p3Trick = [];
        this.p0Cards = [];
        this.p1Cards = [];
        this.p2Cards = [];
        this.p3Cards = [];
        this.deck = [];
        this.discards = [];
        this.currentHighBid = 0;
        this.trumpSuit ="";
        this.winningBidder = "";
        this.playerBidAmounts = [0,0,0,0];
        this.bidCounter=0;
        //trick and determine winner variables
        this.totalHandsPlayed = 0;
        this.playHandCounter = 0;
        this.indexStartingPlayer = 1;
        this.handsPlayed = 0;
        this.offJack;
        this.bossJack;
        this.bug;
        this.high;
        this.low=14; //set arbitarily high
        this.lowPlayer;
        this.trick = []; //needs to be global because user function and computer function use it
        this.leadSuit;
        this.currentHighValue;
    }
}
//card deck
var suits = ["clubs","spades","diamonds","hearts"];
var values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var deck = [];

//hide all of the prompts until later in the game when needed
document.getElementById("gameEnd").classList.add("hidden");
document.getElementById("playerSuitSelection").classList.add("hidden"); //make suit selection hidden default
document.getElementById("discard").classList.add("hidden");
document.getElementById("computerWonBid").classList.add("hidden");

//gameplay variables
var timer = ms => new Promise(res => setTimeout(res, ms));
var delay = 1000;
var game = new Game();
var usScore = 0;
var themScore = 0;
var dealerOrder = ['west', 'south', 'east', 'north']
var currentDealerIndex = 0; //west intitial
var currentBidderIndex = 1; //south initial
document.getElementById("dealerValue").innerText=dealerOrder[currentDealerIndex]; //display dealer
var currentHighBid = 0;
var trumpSuit ="";
var winningBidder = "";
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
var bossJack;
var bug;
var high;
var low=14; //set arbitarily high
var lowPlayer;
var trick = []; //needs to be global because user function and computer function use it
var leadSuit;
var currentHighValue;
startGame();

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
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex];
            }
            currentBidderIndex++;
            bid();
            break;
        case '3':
            if(currentHighBid < 3){
                bidBtnHelper(bidAmt);
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex];
            }
            currentBidderIndex++;
            bid();
            break;
        case '4':
            if(currentHighBid < 4){
                bidBtnHelper(bidAmt);
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex];
            }
            currentBidderIndex++;
            bid();
            break;
        case '5':
            if(currentHighBid < 5){
                bidBtnHelper(bidAmt);
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex];
            }
            currentBidderIndex++;
            bid();
            break;
        case '6':
            if(currentHighBid < 6){
                bidBtnHelper(bidAmt);
                document.getElementById("bidderDirection").innerText=dealerOrder[currentBidderIndex];
            }
            currentBidderIndex++;
            bid();
            break;
        case 'pass':
            document.getElementById("southValue").innerText='pass';
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
                console.log("trump suit: " + trumpSuit);
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
    //identify off jack and boss jack
    
    if(trumpSuit === 'hearts'){
        offJack = new Card("diamonds",11);
        bossJack = new Card("hearts", 10);
    }
        
    if(trumpSuit === 'diamonds'){
        offJack = new Card("hearts",11);
        bossJack = new Card("diamonds",11);
    }
    if(trumpSuit === 'clubs'){
        offJack = new Card("spades",11);
        bossJack = new Card("clubs",11);
    }

    if(trumpSuit === 'spades'){
        offJack = new Card("clubs",11);
        bossJack = new Card("spades",11);
    }
    //right here we can check if the card is 14,2,jack,off,bug of trump
    let player1Cards = document.querySelectorAll(".player1");
    console.log("discard logic-------------------");
    console.log(game.p1Cards);
    console.log(player1Cards);
    for(let i = 0; i < game.p1Cards.length; i++){
        if(canUserDiscard(game.p1Cards[i])){ // i know this is bad practice but hey...
            player1Cards[i].addEventListener('click', () => {
                player1Cards[i].classList.add("translateY");
                let temp = deck.pop();
                game.p1Cards[i] = temp;
            });
        }
        else{
            player1Cards[i].classList.add("darkenImage");
        }
        
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
function canUserDiscard(argCard){
    console.log("!!! take a look at each players cards p0 to p3");
    console.log(game.p0Cards);
    console.log(game.p1Cards);
    console.log(game.p2Cards);
    console.log(game.p3Cards);
    console.log("argCard: " + argCard);
    //return true if we can discard
    let canDiscard = true;
    if(argCard.suit == trumpSuit && argCard.value == 14) //high
        canDiscard = false;
    if(argCard.suit == trumpSuit && argCard.value == 2) //low
        canDiscard = false;
    if(argCard.toString() == bossJack.toString()) //bossJack
        canDiscard = false;
    if(argCard.toString() == offJack.toString()) //offJack
        canDiscard = false;
    if(argCard.value == 20)
        canDiscard = false;
    return canDiscard;
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
    findLow();
    playHand();
}
//need to determine who holds the low before hands get played
function findLow(){
    let counter = 0;
    for(let j = 0; j < 4; j++){
        for(let i = 0; i < game[`p${j}Cards`].length; i++){
            if(game[`p${j}Cards`][i].suit == trumpSuit){
                if(game[`p${j}Cards`][i].value < low){
                    low = game[`p${j}Cards`][i].value;
                    lowPlayer = j;
                }
            }
        }
    }
}

async function handleClick(){
    let i = this.classList[2][3];
    player1Cards[i].classList.add("translatep1Play");
    let obj = {
        card:game.p1Cards[i],
        node:player1Cards[i]
    }
    if(playHandCounter==0)
        leadSuit = obj.card.suit;
    game.p1Cards[i].played = true;
    console.log(`player# 1 making null values:`  + obj.card.toString());
    trick.push(obj);
    indexStartingPlayer++;
    playHandCounter++
    await timer(delay);
    playHand();
}
//i do need to flag played cards
function checkleadSuit(argCard){
    //we need to check if suit == leadSuit and that it hasn't been played or if its off or bug
    let isLeadSuit = false;
    if(argCard.suit == leadSuit && argCard.played == false)
        isLeadSuit = true;
    if(argCard.toString() == offJack.toString() && argCard.played == false)
        isLeadSuit = true;
    if(argCard.value == 20 && argCard.played == false)
        isLeadSuit = true;
    return isLeadSuit;
}
function userHandSetup(){
    console.log("leadsuit: " + leadSuit);
    player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].classList.remove("darkenImage");
        document.removeEventListener("click", handleClick);
    }
    if(leadSuit == null){ //no suit to follow so all should be active to click
        for(let i = 0; i < player1Cards.length; i++)
            player1Cards[i].addEventListener('click', handleClick);
    }
    else{//in here we know leadsuit is already set so we need to look for leadsuit cards
        let hasLeadSuit = false;
        //search the cards array for leadsuit cards that haven't been played.
        for(let i = 0; i < game.p1Cards.length; i++){
            if(checkleadSuit(game.p1Cards[i])) //
                hasLeadSuit=true;                
        }
        if(hasLeadSuit){
            console.log("debug line 456 second hand");
            for(let i = 0; i < game.p1Cards.length; i++){
                if(checkleadSuit(game.p1Cards[i])){
                    console.log("addeventlister its trump");
                    console.log(player1Cards[i]);
                    player1Cards[i].addEventListener('click', handleClick); //this is bad form
                }
                    
                else{
                    console.log("darken itsnot trump"); //bug in this
                    console.log(player1Cards[i]);
                    player1Cards[i].classList.add("darkenImage");
                }
            }
        }
        else{ //we have no leadSuit, every card is free game and doesn't need any darkening
            for(let i = 0; i < player1Cards.length; i++){
                player1Cards[i].addEventListener('click', handleClick);
            }
        }
    }
}


//takes in a player and a card. returns what card to play
function checkTrump(argCard){
    console.log("istrumporPlayed")
    console.log(argCard);
    let isTrump = false; //make it true
    console.log(argCard.suit);
    console.log(trumpSuit);
    console.log(argCard.played);
    if(argCard.suit == trumpSuit && argCard.played == false)
        isTrump = true;
    if(argCard.toString() == offJack.toString() && argCard.played == false)
        isTrump = true;
    if(argCard.value == 20 && argCard.played == false)
        isTrump = true;
    console.log("value of isTrump: " + isTrump);
    return isTrump;
}
function whatCardToPlay(currentPlayer, currentHand){
    console.log("what card to play");
    console.log("current player: " + currentPlayer);
    console.log("current hand: " + currentHand);
    let largestLeadSuit = {
        value:null,
        index:null
    };
    let runJack = {
        value:null,
        index:null
    };
    let whatsLeft = {
        value:null,
        index:null
    };
    if(playHandCounter == 0){ //computer is the leader and should try to play largest trump
        for(let i = 0; i < game[`p${currentPlayer}Cards`].length; i++){
            if(checkTrump(game[`p${currentPlayer}Cards`][i])){
                if(leadSuit == null){//first trump card identified
                    leadSuit = game[`p${currentPlayer}Cards`][i].suit;
                    largestLeadSuit.value = game[`p${currentPlayer}Cards`][i].value;
                    largestLeadSuit.index = i;
                }
                if(largestLeadSuit.value < game[`p${currentPlayer}Cards`][i].value){ //there is another trump find largest
                    leadSuit = game[`p${currentPlayer}Cards`][i].suit;
                    largestLeadSuit.value = game[`p${currentPlayer}Cards`][i].value;
                    largestLeadSuit.index = i;
                }
            }
        }
        //if not trump just play anything
        if(leadSuit == null){
            for(let i = 0 ; i < game[`p${currentPlayer}Cards`].length; i++){
                //if(game[`p${currentPlayer}Cards`][i].value != null)
                if(game[`p${currentPlayer}Cards`][i].played == false){ //its avaiable
                    leadsuit = game[`p${currentPlayer}Cards`][i].suit;
                    whatsLeft.value = game[`p${currentPlayer}Cards`][i].value;
                    whatsLeft.index = i;
                }
            }
        }
        //lets return if playhand=0
        if(largestLeadSuit.index != null)
            return largestLeadSuit.index;
        return whatsLeft.index;
    }
    
    
    console.log("leadSuit: " + leadSuit);
    //we are going to play the 1. largest leadSuite 2.run a jack 3.anthing left
    //we need to find if we have leadSuite and we need to keep everything in same array to
    //keep the indexes valid. if we make a new array with different indexes its too much
    //the i value is what we need to return.
    for(let i = 0; i < game[`p${currentPlayer}Cards`].length; i++){
        if(checkTrump(game[`p${currentPlayer}Cards`][i])){
        //if(game[`p${currentPlayer}Cards`][i].suit == leadSuit && game[`p${currentPlayer}Cards`][i].played == false){
            if(largestLeadSuit == null){
                largestLeadSuit.value = game[`p${currentPlayer}Cards`][i].value;
                largestLeadSuit.index = i;
            }
            if(largestLeadSuit.value < game[`p${currentPlayer}Cards`][i].value){
                largestLeadSuit.value = game[`p${currentPlayer}Cards`][i].value;
                largestLeadSuit.index = i;
            }       
        }
    }
    if(largestLeadSuit.value == null){
       console.log("we dont have any leadsuit. lets run a jack");
        for(let i = 0; i < game[`p${currentPlayer}Cards`].length; i++){
            if(game[`p${currentPlayer}Cards`][i].toString() == bossJack.toString() && game[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = game[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
            if(game[`p${currentPlayer}Cards`][i].toString() == offJack.toString() && game[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = game[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
            if(game[`p${currentPlayer}Cards`][i].value == 20 && game[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = game[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
        }
    }
    if(runJack.value == null){
        console.log("dont have whats led or a jack to run, in whatsleft");
        //make sure we find something that isn't null those cards have already been played
        for(let i = 0; i < game[`p${currentPlayer}Cards`].length; i++){
         //   console.log("in whats left loop")
          //  console.log(game[`p${currentPlayer}Cards`][i].value);
            //if(game[`p${currentPlayer}Cards`][i].value != null){
            if(game[`p${currentPlayer}Cards`][i].played == false){
                whatsLeft.value = game[`p${currentPlayer}Cards`][i];
                whatsLeft.index = i;
            }
        }
    }
    console.log("what card to play!!");
    console.log("largestLeadSuite: " + largestLeadSuit.value);
    console.log("largestLeadSuite index: " + largestLeadSuit.index);
    console.log("runJack: " + runJack.value);
    console.log("runJack index: " + runJack.index);
    console.log("whatsleft: " + whatsLeft.value);
    console.log("whatsleft index: " + whatsLeft.index);
    console.log("determinine index.");

    if(largestLeadSuit.index != null)
        return largestLeadSuit.index;
    if(runJack.index != null)
        return runJack.index;
    return whatsLeft.index;
}
    
//we need to have the computer play the offjack and bug as trump. the shaded and click should be open for these
async function playHand(){
    let nodeCards = { //make it an object so we can use string interpolation to access the values
        player0Cards: document.querySelectorAll(".player0"),
        player1Cards: document.querySelectorAll(".player1"),
        player2Cards: document.querySelectorAll(".player2"),
        player3Cards: document.querySelectorAll(".player3"),
    }
    while(totalHandsPlayed < 6){
        while(playHandCounter < 4){
            if(indexStartingPlayer == 1){ //the user will decide what to play
                //this is a time we can call a helper function to set what cards darken and are clickable
                userHandSetup();
                return;
            }
            //we need to add logic as to what cards to play
            //this function is big enough lets call another function
            let playIndex = whatCardToPlay(indexStartingPlayer, totalHandsPlayed);
            console.log("debug line 620");
            console.log("indexStartingPlayer: " + indexStartingPlayer + " playIndex: " + playIndex);
            console.log("nodeCards[`player${indexStartingPlayer}Cards`][playIndex]");
            console.log(nodeCards[`player${indexStartingPlayer}Cards`][playIndex]);
            nodeCards[`player${indexStartingPlayer}Cards`][playIndex].classList.add(`translatep${indexStartingPlayer}Play`);
            let obj = {
                card:game[`p${indexStartingPlayer}Cards`][playIndex],
                node:nodeCards[`player${indexStartingPlayer}Cards`][playIndex]
            }
            if(playHandCounter==0) //first one to start sets the leadSuit
                leadSuit = obj.card.suit;
            if(playIndex != null){
                //mark the values as played
                console.log(`player# ${indexStartingPlayer} making null values:`  + game[`p${indexStartingPlayer}Cards`][playIndex]);
                game[`p${indexStartingPlayer}Cards`][playIndex].played = true;
            }
            trick.push(obj);
            playHandCounter++
            indexStartingPlayer++;
            if(indexStartingPlayer == 4) //for some reason when i did indexstatingpalyer %4 it was inconsistent
                indexStartingPlayer=0;
            await timer(delay);
        }
        playHandCounter = 0;
        indexStartingPlayer = determineTrickWinner(trick);    
        console.log("retured from determine Trick indexStartingPlayer: " + indexStartingPlayer);
        totalHandsPlayed++;
    }
}

//pass in trick that contains cards and nodes of the cards played. function needs to figure out who won
//they are all getting null values. I need to have a flag i can set to say played
function determineTrickWinner(trickArg){
    /*
    tump = diamonds first player starts ace clubs. second player runs off jack, third plays clubs, four plays 3 hearts.
    winner is second player running off jack is trump and no higher trump in this hand
    */
    
    console.log("trick");
    let currentLeader; //player index
    let startingSuitHighValue = "";
    let startingSuit;
    let trumpingInSuit = null; //someone can trump in and not be in starting suit
    let trumpingInHighValue = null; //we need to know the value 2 players can trump in
    for(let i = 0; i < trickArg.length; i++){
        //every card has a player#, suit and value. populate those first
        let player = trickArg[i].node.classList[0][6];
        let value = trickArg[i].card.value;
        let suit = trickArg[i].card.suit;
        if(i == 0){
            currentLeader=player;
            currentHighCard=value;
            startingSuit=suit;
        }
        if(trickArg[i].card.toString() == offJack.toString()){
            console.log("OFFJACK");
            suit = trumpSuit;
            if(i == 0)
                startingSuit = trumpSuit;
            value=10.9; //a little weaker than boss jack
        }
        if(trickArg[i].card.value == 20){
            console.log("BUG");
            suit = trumpSuit;
            value=10.8;
        }
        console.log("suit: " + suit);
        console.log("startingSuit: " + startingSuit);
        if(suit == startingSuit){ //we are of the same suit as what was led. if somone already trumped in skip it
            if(trumpingInSuit == null){
                console.log("same suit, nobody trumped in yet");
                if(value > currentHighCard){
                    currentLeader=player;
                    currentHighCard=value;
                }
            } 
        }
        else if(suit == trumpSuit){ //trumping in
            console.log("trumping in");
            console.log("player: " + player);
            //check if its already been trumped in on
            if(trumpingInSuit == null){ //since they are first to trump they lead now
                trumpingInHighValue = value;
                trumpingInSuit = suit;
                currentLeader=player;
                currentHighCard=null;
            }
            else{//we need to compare values others have trumped already
                if(trumpingInHighValue < value){
                    trumpingInHighValue = value;
                    currentLeader=player;
                }
            }
        }
    }
    
    if(trumpingInSuit == null){
        console.log("current high card: " + currentHighCard);
        console.log("suit that won it: " + startingSuit);
    }
    else{
        console.log("current high card: " + trumpingInHighValue);
        console.log("suit that won it: " + trumpingInSuit);
    }
    console.log("player that won the trick: " + currentLeader);
    
    if(currentLeader == 0){
        for(let i = 0; i < trickArg.length; i++){
            trickArg[i].node.classList.add("trick0");
            console.log("adding trick0 to every card in play");
        }
        p0Trick.push(trickArg);
    }
    if(currentLeader == 1){
        for(let i = 0; i < trickArg.length; i++)
        trickArg[i].node.classList.add("trick1");
        p1Trick.push(trickArg); 
    }
          
    if(currentLeader == 2){
        for(let i = 0; i < trickArg.length; i++)
        trickArg[i].node.classList.add("trick2");
        p2Trick.push(trickArg); 
    }  
    if(currentLeader == 3){
        for(let i = 0; i < trickArg.length; i++)
        trickArg[i].node.classList.add("trick3");
        p3Trick.push(trickArg); 
    }
    trick=[]; //reset the global trick
    handsPlayed++;
    leadSuit = null;
    console.log("hands played: " + handsPlayed);
    if(handsPlayed == 6)
        tallyGamePoints();
    else
        return currentLeader;
}
function calcHigh(argCard){
    if(argCard.suit == trumpSuit){
        if(argCard.value > currentHighValue){
            currentHighValue = argCard.value;
            return argCard.value;
        }
    }
}
function calcBoss(argCard){
    if(argCard.toString() == bossJack.toString())
        return true;
}
function calcOff(argCard){
    if(argCard.toString() == offJack.toString())
        return true;
}
function calcBug(argCard){
    if(argCard.value == 20)
        return true;

}
function calcGew(argVal){
    if(argVal == 10)
        return 10;
    if(argVal == 11)
        return 1;
    if(argVal == 12)
        return 2;
    if(argVal == 13)
        return 3;
    if(argVal == 14)
        return 4;
    if(argVal == 20)
        return 1;
    return 0;
}
//we need to be setting the low as the game is played. I guess after redeal we could look through as see who has the low
function tallyGamePoints(){
    console.log("in tally game points");
    document.getElementById("gameEnd").classList.remove("hidden");
    //determine who won gew
    let usGew = 0;
    let themGew = 0;
    let high = {
        value:null,
        player:null
    }
    let offPlayer = null;
    let bossPlayer = null;
    let bugPlayer = null;
    for(let i = 0; i < p0Trick.length; i++){
        for(let j = 0; j < p0Trick[i].length; j++){
            themGew += calcGew(p0Trick[i][j].card.value)
            temp = calcHigh(p0Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 0;
            }
            if(calcOff(p0Trick[i][j].card))
                offPlayer = 0;
            if(calcBoss(p0Trick[i][j].card))
                bossPlayer = 0;
            if(calcBug(p0Trick[i][j].card))
                bugPlayer = 0;
        }
    }
    for(let i = 0; i < p1Trick.length; i++){
        for(let j = 0; j < p1Trick[i].length; j++){
            usGew += calcGew(p1Trick[i][j].card.value)
            temp = calcHigh(p1Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 1;
            }
            if(calcOff(p1Trick[i][j].card))
                offPlayer = 1;
            if(calcBoss(p1Trick[i][j].card))
                bossPlayer = 1;
            if(calcBug(p1Trick[i][j].card))
                bugPlayer = 1;
        }
    }

    for(let i = 0; i < p2Trick.length; i++){
        for(let j = 0; j < p2Trick[i].length; j++){
            themGew += calcGew(p2Trick[i][j].card.value)
            temp = calcHigh(p2Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 2;
            }
            if(calcOff(p2Trick[i][j].card))
                offPlayer = 2;
            if(calcBoss(p2Trick[i][j].card))
                bossPlayer = 2;
            if(calcBug(p2Trick[i][j].card))
                bugPlayer = 2;
        }
    }

    for(let i = 0; i < p3Trick.length; i++){
        for(let j = 0; j < p3Trick[i].length; j++){
            usGew += calcGew(p3Trick[i][j].card.value)
            temp = calcHigh(p3Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 3;
            }
            if(calcOff(p3Trick[i][j].card))
                offPlayer = 3;
            if(calcBoss(p3Trick[i][j].card))
                bossPlayer = 3;
            if(calcBug(p3Trick[i][j].card))
                bugPlayer = 3;
        }
    }   
    //display calulations
    if(usGew > themGew){
        document.getElementById("gewUs").innerText = 1;
        usScore += 1;
    }
    else{
        document.getElementById("gewThem").innerText = 1;
        themScore += 1;
    }
    if(high.player == 0 || high.player == 2){
        document.getElementById("highThem").innerText = 1;
        themScore += 1;
    }   
    else{
        document.getElementById("highUs").innerText = 1;
        usScore += 1;
    }
        
    if(offPlayer == 0 || offPlayer == 2){
        document.getElementById("offThem").innerText = 1;
        themScore += 1;
    }
    if(offPlayer == 1 || offPlayer == 3){
        document.getElementById("offUs").innerText = 1;
        usScore += 1;
    }
    if(bossPlayer == 0 || bossPlayer == 2){
        document.getElementById("bossThem").innerText = 1;
        themScore += 1;
    }
    if(bossPlayer == 1 || bossPlayer == 3){
        document.getElementById("bossUs").innerText = 1;
        usScore += 1;
    }
        
    if(bugPlayer == 0 || bugPlayer == 2){
        document.getElementById("bugThem").innerText = 1;
        themScore += 1;
    }
        
    if(bugPlayer == 1 || bugPlayer == 3){
        document.getElementById("bugUs").innerText = 1;
        usScore += 1;
    }
        
    if(lowPlayer == 0 || lowPlayer == 2){
        document.getElementById("lowThem").innerText = 1;
        themScore += 1;
    }
        
    if(lowPlayer == 1 || lowPlayer == 3){
        document.getElementById("lowUs").innerText = 1;
        usScore += 1;
    }
    //update scoreboard
    let indexWinningBidder = dealerOrder.indexOf(winningBidder);
    if(indexWinningBidder == 0 || indexWinningBidder == 2){
        if(themScore < currentHighBid){
            document.getElementById("gameOverMessage").innerText = `bad guys got set backwards for ${currentHighBid}`;
            themScore = currentHighBid - currentHighBid - currentHighBid;
        }
        else
            document.getElementById("gameOverMessage").innerText = "bad guys won the hand";
    }
    else{
        if(usScore< currentHighBid){
            document.getElementById("gameOverMessage").innerText = `good guys got set backwards for ${currentHighBid}`;
            console.log("us score before subtraction: " + usScore);
            usScore = currentHighBid - currentHighBid - currentHighBid;
            console.log("us score after subtraction: " + usScore);
        }
        else
            document.getElementById("gameOverMessage").innerText = "good guys won the hand";
    }
    document.getElementById("scoreGoodGuys").innerText = usScore;
    document.getElementById("scoreBadGuys").innerText = themScore;
    //end of game logic
    if(usScore > 20 || themScore > 20){ //game is over. we need to check for Staubs case bidder wins if both go out
        if(usScore > 20 && themScore > 20){ //the bidder wins
            if(indexWinningBidder == 1 || indexWinningBidder == 3)
                alert("Good guys won the Game!!! STAUBS!!!");
            else
                alert("Bad guys won the Game!!! STAUBS!!!!!");
        }
        else{ //only 1 player went out print who it is
            if(usScore > 20)
                alert("good Guys win it again!!");
            else  
                alert("Bad Guys win it booooo!!");
        }
        //reset the usScore and themscore
        usScore = 0;
        themScore = 0;
    }

    restartGame();
}
async function restartGame(){
    console.log("going to restart game");
    await timer(4000);
    document.getElementById("gameEnd").classList.add("hidden");
    document.getElementById("playerSuitSelection").classList.add("hidden"); //make suit selection hidden default
    document.getElementById("discard").classList.add("hidden");
    document.getElementById("computerWonBid").classList.add("hidden");
    document.getElementById("biddingTable").classList.remove("hidden"); //hide biddingTable
    document.getElementById("bidderDirection").innerText = "--";
    document.getElementById("bidValue").innerText = "--";
    document.getElementById("trumpSuit").innerText = "--";
    document.getElementById("gameOverMessage").innerText = "";
    let temp = document.querySelectorAll(".gameEndVal");
    for(let i = 0; i < temp.length; i++){
        console.log("before: " + temp[i].innerText);
        temp[i].innerText = "--";
    }
    //move the dealer over, clear the bid, trump suit
    currentDealerIndex++;
    currentBidderIndex = currentDealerIndex + 1;
    if(currentBidderIndex == 4)
        currentBidderIndex = 0;
    document.getElementById("dealerValue").innerText = dealerOrder[currentDealerIndex];
    document.getElementById("bidderDirection").innerText = dealerOrder[currentBidderIndex];
    document.getElementById("westValue").innerText = "--";
    document.getElementById("eastValue").innerText = "--";
    document.getElementById("northValue").innerText = "--";
    document.getElementById("southValue").innerText = "--";
    //reset the global variables
    trumpSuit = null;
    currentHighBid = null;
    currentHighBid = 0;
    trumpSuit ="";
    winningBidder = "";
    playerBidAmounts = [0,0,0,0];
    bidCounter=0;
    discards = [];
    p0Trick = [];
    p1Trick = [];
    p2Trick = [];
    p3Trick = [];
    game.p0Cards = [];
    game.p1Cards = [];
    game.p2Cards = [];
    game.p3Cards = [];
    totalHandsPlayed = 0;
    playHandCounter = 0;
    indexStartingPlayer = currentBidderIndex;
    handsPlayed = 0;
    offJack = null;
    bossJack = null;
    bug = null;
    high = null;
    low=14; //set arbitarily high
    lowPlayer = null;
    trick = []; //needs to be global because user function and computer function use it
    deck = [];
    leadSuit = null;
    currentHighValue = null;
    //player0 1 2 3 4 cards are still in the dom and should be removed
    let player0Cards = document.querySelectorAll(".player0");
    let player1Cards = document.querySelectorAll(".player1");
    let player2Cards = document.querySelectorAll(".player2");
    let player3Cards = document.querySelectorAll(".player3");
    let obj = {
        p0:player0Cards,
        p1:player1Cards,
        p2:player2Cards,
        p3:player3Cards
    }
    for(let j = 0; j < 4; j++){
        for(let i = 0; i < obj[`p${j}`].length; i++){
            console.log("removing cards should be 24");
            obj[`p${j}`][i].remove();
        }
    }
    startGame();
}