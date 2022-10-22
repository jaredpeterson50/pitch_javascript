//card class has a value, suit, and played flag init to false
class Card{
    constructor(suit, value){
        this.value = value;
        this.suit = suit;
        this.played = false;
    }
    toString() { return `(${this.value}${this.suit})`; } //can use this to compare cards
}
//these game varables persist for the entire game, several hands
class Game{
    constructor(){
        this.suits = ["clubs","spades","diamonds","hearts"];
        this.values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.usScoreTotal = 0; //cummunlative score
        this.themScoreTotal = 0; //cumunlative score
        this.dealerOrder = ['east', 'south', 'west', 'north'];
        this.currentDealerIndex = 0; //west intitial
        this.currentBidderIndex = 1; //south initial
    }
}
//hand variables that get reset after each hand
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
        this.isToggledUp = [false,false,false,false,false,false];//for each card goes true on discard
        this.usScore = 0;
        this.themScore = 0;
        this.currentHighBid = 0;
        this.trumpSuit ="";
        this.winningBidder = "";
        this.playerBidAmounts = [0,0,0,0];
        this.bidCounter=0;
        //trick and determine winner variables
        this.totalHandsPlayed = 0;
        this.playHandCounter = 0;
        this.indexCurrentPlayer = 1;
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
    reset(){
        console.log("reset the hand");
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
        this.isToggledUp = [false,false,false,false,false,false];//for each card goes true on discard
        this.usScore = 0;
        this.themScore = 0;
        this.currentHighBid = 0;
        this.trumpSuit ="";
        this.winningBidder = "";
        this.playerBidAmounts = [0,0,0,0];
        this.bidCounter=0;
        //trick and determine winner variables
        this.totalHandsPlayed = 0;
        this.playHandCounter = 0;
        this.indexCurrentPlayer = 1;
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

//hide all of the prompts until later in the game when needed
document.getElementById("gameEnd").classList.add("hidden");
document.getElementById("playerSuitSelection").classList.add("hidden"); //make suit selection hidden default
document.getElementById("discard").classList.add("hidden");
document.getElementById("computerWonBid").classList.add("hidden");

let game = new Game();
let hand = new Hand();

var timer = ms => new Promise(res => setTimeout(res, ms));
var delay = 1000;
startGame();

function startGame(){
    document.getElementById("dealerValue").innerText=game.dealerOrder[game.currentDealerIndex];
    //document.getElementById("bidderDirection").innerText=game.dealerOrder[game.currentBidderIndex];
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
    hand.deck.push(joker);
    for(let i = 0; i < game.suits.length; i++){
        for(let j = 0; j < game.values.length; j++){
            var newCard = new Card(game.suits[i],game.values[j]);
            hand.deck.push(newCard);
        }
    }
}

//shuffle function, there are 53 cards so we will multiply the float
// that is between 0(inclusive)-1(not inclusive) this will make the max value 52 which work for 0-52 index
function shuffle(){
    for(let i = 0; i < 1000; i++){
        let pos1 = Math.floor(Math.random()*53);
        let pos2 = Math.floor(Math.random()*53);
        let temp = hand.deck[pos1];
        hand.deck[pos1] = hand.deck[pos2];
        hand.deck[pos2] = temp;
    }
}


function deal(){
    //players 1,2,3,4
    for(let i = 0; i < 4; i++){
        //cards 1,2,3,4,5,6
        for(let j = 0; j < 6; j++){
            let card = hand.deck.pop();
            hand[`p${i}Cards`].push(card);
        }
    }
}
//we can upgrade this by putting the trump suit in the 0 index on the redeal
function sortBySuit(){
    let sorted = []
    let suits = ["clubs","spades","diamonds","hearts", "joker"];// dont forget the joker
    for(let k = 0; k < 4; k++){ 
        for(let i = 0; i < suits.length; i++){ 
            for(let j = 0; j < hand[`p${k}Cards`].length; j++){ 
                if(hand[`p${k}Cards`][j].suit == suits[i]){
                    sorted.push(hand[`p${k}Cards`][j]);
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
        hand[`p${k}Cards`] = sorted;
        sorted=[]; //emtpty it for the next loop
    }
}
//we are going to creat the divs and img elements assigning the .svg image to the corresponding card each player has
function showCards(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 6; j++){
            const newCard = document.createElement("div");
            //for each card we adding 3 classes. ex player0, cardPlayer, p0c1
            newCard.classList.add(`player${i}`, 'cardPlayer', `p${i}c${j}`);
            document.body.appendChild(newCard);
            const pic = document.createElement("img");
            const path = "img/" + hand[`p${i}Cards`][j].suit + hand[`p${i}Cards`][j].value + ".svg";
            pic.src=path;
            newCard.appendChild(pic);
        }
    }
}
//prevent repetative code in the userBid switch statement
function userBidBHelper(bidAmount){
    document.getElementById("southValue").innerText=bidAmount;
    document.getElementById("bidValue").innerText=bidAmount;
    hand.currentHighBid=Number.parseInt(bidAmount);
    hand.winningBidder=game.dealerOrder[game.currentBidderIndex];
    document.getElementById("bidderDirection").innerText=game.dealerOrder[game.currentBidderIndex];
}

function userBid(bidAmt){
    hand.playerBidAmounts[1] = bidAmt;
    switch(bidAmt){
        case '2':
            if(hand.currentHighBid < 2)
                userBidBHelper(bidAmt);
            game.currentBidderIndex++;
            bid();
            break;
        case '3':
            if(hand.currentHighBid < 3)
                userBidBHelper(bidAmt);
            game.currentBidderIndex++;
            bid();
            break;
        case '4':
            if(hand.currentHighBid < 4)
                userBidBHelper(bidAmt);
            game.currentBidderIndex++;
            bid();
            break;
        case '5':
            if(hand.currentHighBid < 5)
                userBidBHelper(bidAmt);
            game.currentBidderIndex++;
            bid();
            break;
        case '6':
            if(hand.currentHighBid < 6)
                userBidBHelper(bidAmt);
            game.currentBidderIndex++;
            bid();
            break;
        case 'pass':
            document.getElementById("southValue").innerText='pass';
            game.currentBidderIndex++;
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
    while(hand.bidCounter < 4){
        hand.bidCounter++;
        if(game.currentBidderIndex === 1){  //exit the loop if its the users turn to bid. then re enter function
            await timer(delay);
            return;
        }
        else{
            const bidObj = cpucpuBidLogic(); //computer decides what to bid
            if(bidObj.bid > hand.currentHighBid){
                hand.currentHighBid = bidObj.bid;
                hand.trumpSuit=bidObj.suit;
                hand.winningBidder=game.dealerOrder[game.currentBidderIndex];
                hand.indexCurrentPlayer=game.currentBidderIndex; //default is set for player1, else set here
                console.log("trump suit: " + hand.trumpSuit);
                document.getElementById("bidderDirection").innerText=game.dealerOrder[game.currentBidderIndex]; //display bidder
            }
            //below populated bid table with each players bid
            document.getElementById(`${game.dealerOrder[game.currentBidderIndex]}Value`).innerText=bidObj.bid;
            document.getElementById("bidValue").innerText=hand.currentHighBid;
        }
        await timer(delay);
        game.currentBidderIndex++;
        if(game.currentBidderIndex == 4) //the %4 approach seems inconsistent for some reason
            game.currentBidderIndex=0;
    }
   chooseSuit();
}

function cpucpuBidLogic(){
    let bidAmount = 0;
    let suitBidAmount = [0,0,0,0]; //init to zero each value
    //go thru each card putting values of points into the suitBidAmount array
    for(let i = 0; i < 6; i++){
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==14) //we have an ace what suite? hears lets say
            suitBidAmount[game.suits.indexOf(hand[`p${game.currentBidderIndex}Cards`][i].suit)] += 2; 
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==2) // we have a low
            suitBidAmount[game.suits.indexOf(hand[`p${game.currentBidderIndex}Cards`][i].suit)] += 1.1;
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==20){// we have a joker every suite .5 add
            for(let j = 0; j < 4; j++)
                suitBidAmount[j] += .5;
        }
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==11){ //jack add .5 to both trump and off suite 0,1 or ,2,3
            suitBidAmount[game.suits.indexOf(hand[`p${game.currentBidderIndex}Cards`][i].suit)] += .5;   
        }
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==12){ //queen add .25
            suitBidAmount[game.suits.indexOf(hand[`p${game.currentBidderIndex}Cards`][i].suit)] += .25; 
        }
        if(hand[`p${game.currentBidderIndex}Cards`][i].value==13){ //king add .25
            suitBidAmount[game.suits.indexOf(hand[`p${game.currentBidderIndex}Cards`][i].suit)] += .25; 
        }      
    }
    bidAmount= Math.max.apply(Math, suitBidAmount);
    let roundedBidAmount = Math.ceil(bidAmount); //take the ceiling of the largest number in the array to bid
    if(hand.currentHighBid >= roundedBidAmount || roundedBidAmount < 2)//not a new high bidder or dont have a 2 bid
        roundedBidAmount="pass";
    if(hand.currentHighBid < 2 && hand.bidCounter == 3) //if your the last bidder you need to bid 2 and dont over bid
        roundedBidAmount=2;
    const retVal = {
        bid: roundedBidAmount,
        suit: game.suits[suitBidAmount.indexOf(bidAmount)]
    }
    return retVal;
}

function chooseSuit(){
    document.getElementById("biddingTable").classList.add("hidden"); //hide biddingTable
    if(hand.winningBidder === 'south')//check if user won bid or computer
        document.getElementById("playerSuitSelection").classList.remove("hidden"); //show playerSuitSelection
    else{
        let node = document.getElementById("computerWonBid");
        node.innerText = `${hand.winningBidder} won the bid in  ${hand.trumpSuit} with a bid of ${hand.currentHighBid}`;
        document.getElementById("trumpSuit").innerText= `${hand.trumpSuit}`;
        document.getElementById("computerWonBid").classList.remove("hidden") //show computer won bid and discard
        document.getElementById("discard").classList.remove("hidden");
        discardLogic();
    }    
}
//called from the suit buttons onclick event from index.html
function suiteSelection(userSuit){
    document.getElementById("playerSuitSelection").classList.add("hidden");
    document.getElementById("discard").classList.remove("hidden");
    hand.trumpSuit = userSuit;
    document.getElementById("trumpSuit").innerText= `${hand.trumpSuit}`;
    discardLogic();
}
//for the user to click what cards to discard. the toggleCards up is to discard but can be clicked again to put back
function toggleCardsUp(){
    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < hand.p1Cards.length; i++){
        if(canUserDiscard(hand.p1Cards[i])){//we are mixing the i values of different arrays but i dont know how else
            if(hand.isToggledUp[i] == false){
                player1Cards[i].addEventListener('click', () => {
                player1Cards[i].classList.add(`p1c${i}Up`); //change this to string interpolation p1c0Up
                //player1Cards[i].classList.add("translateY"); //change this to string interpolation
                hand.isToggledUp[i] = true;
                toggleCardsDown();
                }); 
            }
        }
        else
            player1Cards[i].classList.add("darkenImage");        
    }
}
//undoes what toggleCardsUp does and puts the card back in the users hand
function toggleCardsDown(){
    let player1Cards = document.querySelectorAll(".player1");
    for(let i = 0; i < hand.p1Cards.length; i++){
        if(canUserDiscard(hand.p1Cards[i])){//we are mixing the i values of different arrays but i dont know how else
            if(hand.isToggledUp[i] == true){
                player1Cards[i].addEventListener('click', () => {
                player1Cards[i].classList.remove(`p1c${i}Up`);
                //player1Cards[i].classList.remove("translateY");
                hand.isToggledUp[i] = false;
                toggleCardsUp();
                }); 
            }
        }
    }
}

function discardLogic(){
    if(hand.trumpSuit === 'hearts'){
        hand.offJack = new Card("diamonds",11);
        hand.bossJack = new Card("hearts", 10);
    }   
    if(hand.trumpSuit === 'diamonds'){
        hand.offJack = new Card("hearts",11);
        hand.bossJack = new Card("diamonds",11);
    }
    if(hand.trumpSuit === 'clubs'){
        hand.offJack = new Card("spades",11);
        hand.bossJack = new Card("clubs",11);
    }
    if(hand.trumpSuit === 'spades'){
        hand.offJack = new Card("clubs",11);
        hand.bossJack = new Card("spades",11);
    }
    toggleCardsUp();//this allows the user to discard what they want
    for(let j = 0; j < 4; j++){ //4 players total
        if(j ==1) //dont automate player 1 discard
            continue;
        //for the computer we want them to keep any jacks,bug, or trump suit they are delt
        for(let i = 0; i < hand[`p${j}Cards`].length; i++){
            if(hand[`p${j}Cards`][i].value == 20) //joker
                continue;
            if((hand[`p${j}Cards`][i].suit == hand.offJack.suit) && (hand[`p${j}Cards`][i].value == hand.offJack.value))
                continue;
            if(hand[`p${j}Cards`][i].suit !== hand.trumpSuit){
                let temp = hand.deck.pop();
                hand[`p${j}Cards`][i] = temp;
            }
        }
    }
}
//return true if we can discard cant get ride of jacks,high,low,bug
function canUserDiscard(argCard){
    let canDiscard = true;
    if(argCard.suit == hand.trumpSuit && argCard.value == 14) //high
        canDiscard = false;
    if(argCard.suit == hand.trumpSuit && argCard.value == 2) //low
        canDiscard = false;
    if(argCard.toString() == hand.bossJack.toString()) //bossJack
        canDiscard = false;
    if(argCard.toString() == hand.offJack.toString()) //offJack
        canDiscard = false;
    if(argCard.value == 20)
        canDiscard = false;
    return canDiscard;
}
//this entrance to this function is from the done discarding button on index.html onclick event
function reDeal(){
    //this is where we exit the discard toggling.
    //real quick we want to pop some cards off the deck and replace the ones that are flagged true in toggledup
    for(let i = 0; i < hand.isToggledUp.length; i++){
        if(hand.isToggledUp[i] == true){
            let temp = hand.deck.pop();
            hand.p1Cards[i] = temp;
        }
    }
    //remove all cards from the DOM we will deal every card again in showCards
    let allCards = document.querySelectorAll('.cardPlayer');
    for(let i = 0; i < allCards.length; i++)
        allCards[i].remove();
    sortBySuit();
    showCards();
    document.getElementById("discard").classList.add("hidden");
    document.getElementById("computerWonBid").classList.add("hidden");
    findLow();
    findOffBug();
    playHand();
}

//to find the joker we look for a value of 20. if we do we can change the value to 10.8 and suit=trumpsuit
//to find the offJack we look for offsuit and change value to 10.9. bossjack = 11 these are just below
function findOffBug(){
    let offSuit;
    let jokerFound = false;
    let offJackFound = false;
    if(hand.trumpSuit === 'clubs')
        offSuit = "spades";
    if(hand.trumpSuit === 'spades')
        offSuit = "clubs";
    if(hand.trumpSuit === 'hearts')
        offSuit = "diamonds";
    if(hand.trumpSuit === 'diamonds')
        offSuit = "hearts";
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < hand[`p${i}Cards`].length; j++){
            if(hand[`p${i}Cards`][j].value == 20){
                hand[`p${i}Cards`][j].value = 10.8;
                hand[`p${i}Cards`][j].suit = hand.trumpSuit;
            }
            if(hand[`p${i}Cards`][j].value == 11 && hand[`p${i}Cards`][j].suit == offSuit){
                hand[`p${i}Cards`][j].suit = hand.trumpSuit;
                hand[`p${i}Cards`][j].value = 10.9;
            }
        }
    }
}
//need to determine who holds the low before hands get played, you keep the low even if you lose the trick
function findLow(){
    let counter = 0;
    for(let j = 0; j < 4; j++){
        for(let i = 0; i < hand[`p${j}Cards`].length; i++){
            if(hand[`p${j}Cards`][i].suit == hand.trumpSuit){
                if(hand[`p${j}Cards`][i].value < hand.low){
                    hand.low = hand[`p${j}Cards`][i].value;
                    hand.lowPlayer = j;
                }
            }
        }
    }
}
//this function is called when the user clicks a card playing it.
async function handleClick(){
    let i = this.classList[2][3];
    gsap.to(`.p1c${i}`, {rotation: 180, 
    x:(window.innerWidth/2) -100 - player1Cards[i].getBoundingClientRect().left, 
    y: ((window.innerHeight-160)/2) +50- player1Cards[i].getBoundingClientRect().top, duration: 1});
    let obj = {
        card:hand.p1Cards[i],
        node:player1Cards[i]
    }
    if(hand.playHandCounter==0)
        hand.leadSuit = obj.card.suit;
    hand.p1Cards[i].played = true;
 //   console.log("player# 1: "  + obj.card.toString());
    hand.trick.push(obj);
    hand.indexCurrentPlayer++;
    hand.playHandCounter++
    await timer(delay);
    playHand();
}

//checks if the card passed in is leadsuit including jack,bug and hasn't been played yet.
function checkleadSuit(argCard){
    let isLeadSuit = false;
    if(argCard.suit == hand.leadSuit && argCard.played == false)
        isLeadSuit = true;
    if(argCard.toString() == hand.offJack.toString() && argCard.played == false)
        isLeadSuit = true;
    if(argCard.value == 20 && argCard.played == false)
        isLeadSuit = true;
    return isLeadSuit;
}
//this function adds click event listeners to the cards that can be played. darkens the cards that are invalid plays
//you have to follow suit of what is led if you have it. otherwise play anything.
function userHandSetup(){
 //   console.log("leadsuit: " + hand.leadSuit);
    player1Cards = document.querySelectorAll(".player1");
    //before we start remove all old CSS event click listeners and darkenImage
    for(let i = 0; i < player1Cards.length; i++){
        player1Cards[i].classList.remove("darkenImage");
        player1Cards[i].removeEventListener("click", handleClick);
    }
    //no suit to follow so all should be active to click
    if(hand.leadSuit == null){ 
        for(let i = 0; i < player1Cards.length; i++)
            player1Cards[i].addEventListener('click', handleClick);
    }
    else{//in here we know leadsuit is already set so we need to look for leadsuit cards
        //if there isn't any then all cards can be clickable with no darkening
        let hasLeadSuit = false;
        for(let i = 0; i < hand.p1Cards.length; i++){
            if(hand.p1Cards[i].suit == hand.leadSuit && hand.p1Cards[i].played == false)
                hasLeadSuit=true;    
        }
        //we know we have some cards that are of the suit led. add eventlisters to those and darken others
        if(hasLeadSuit){
            for(let i = 0; i < hand.p1Cards.length; i++){
                if(hand.p1Cards[i].played == false && hand.p1Cards[i].suit == hand.leadSuit )
                    player1Cards[i].addEventListener('click', handleClick); //this is bad form but both arrays are 6 length
                else
                    player1Cards[i].classList.add("darkenImage");
            }
        }
        else{ //we have no leadSuit, every card is free game and doesn't need any darkening
            for(let i = 0; i < player1Cards.length; i++)
                player1Cards[i].addEventListener('click', handleClick);
        }
    }
}

//takes in a card. returns true if its tump and hasn't been played
function checkTrump(argCard){
    let isTrump = false; 
    if(argCard.suit == hand.trumpSuit && argCard.played == false)
        isTrump = true;
    if(argCard.toString() == hand.offJack.toString() && argCard.played == false)
        isTrump = true;
    if(argCard.value == 20 && argCard.played == false)
        isTrump = true;
    return isTrump;
}
//returns what card the computer should play. We need to add more fules but to start
//1. play largest of what suit is led. 2. if you dont have a card in the lead suit run a jack.
// if not one of first 2 play the first valid card in your hand
function whatCardToPlayCPU(currentPlayer, currentHand){
  //  console.log("what card to play");
  //  console.log("current player: " + currentPlayer);
  //  console.log("current hand: " + currentHand);
  //  console.log("playhandcounter: " + hand.playHandCounter);
    //console.log("card: " + hand[`p${currentPlayer}Cards`][])
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
    if(hand.playHandCounter == 0){ //computer is the leader and should try to play largest trump
        for(let i = 0; i < hand[`p${currentPlayer}Cards`].length; i++){
            if(checkTrump(hand[`p${currentPlayer}Cards`][i])){
                if(hand.leadSuit == null){//first trump card identified
                    hand.leadSuit = hand[`p${currentPlayer}Cards`][i].suit;
                    largestLeadSuit.value = hand[`p${currentPlayer}Cards`][i].value;
                    largestLeadSuit.index = i;
                }
                if(largestLeadSuit.value < hand[`p${currentPlayer}Cards`][i].value){ //there is another trump find largest
                    hand.leadSuit = hand[`p${currentPlayer}Cards`][i].suit;
                    largestLeadSuit.value = hand[`p${currentPlayer}Cards`][i].value;
                    largestLeadSuit.index = i;
                }
            }
        }
        //if not trump just play anything
        if(hand.leadSuit == null){
            for(let i = 0 ; i < hand[`p${currentPlayer}Cards`].length; i++){
                if(hand[`p${currentPlayer}Cards`][i].played == false){ //its avaiable
                    hand.leadsuit = hand[`p${currentPlayer}Cards`][i].suit;
                    whatsLeft.value = hand[`p${currentPlayer}Cards`][i].value;
                    whatsLeft.index = i;
                }
            }
        }
        //lets return if playhand=0
        if(largestLeadSuit.index != null)
            return largestLeadSuit.index;
        return whatsLeft.index;
    }
   // console.log("leadSuit: " + hand.leadSuit);
    for(let i = 0; i < hand[`p${currentPlayer}Cards`].length; i++){
        if(checkTrump(hand[`p${currentPlayer}Cards`][i])){
     //       console.log("checkTrump returned true");
            if(largestLeadSuit == null){
                largestLeadSuit.value = hand[`p${currentPlayer}Cards`][i].value;
                largestLeadSuit.index = i;
            }
            if(largestLeadSuit.value < hand[`p${currentPlayer}Cards`][i].value){
                largestLeadSuit.value = hand[`p${currentPlayer}Cards`][i].value;
                largestLeadSuit.index = i;
            }       
        }
    }
    if(largestLeadSuit.value == null){
       //console.log("we dont have any leadsuit. lets run a jack");
        for(let i = 0; i < hand[`p${currentPlayer}Cards`].length; i++){
            if(hand[`p${currentPlayer}Cards`][i].toString() == hand.bossJack.toString() && hand[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = hand[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
            if(hand[`p${currentPlayer}Cards`][i].toString() == hand.offJack.toString() && hand[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = hand[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
            if(hand[`p${currentPlayer}Cards`][i].value == 20 && hand[`p${currentPlayer}Cards`][i].played == false){
                runJack.value = hand[`p${currentPlayer}Cards`][i];
                runJack.index = i;
            }
        }
    }
    //dont have leadsuit or a jack to run. populate whatleft with any valid cards to play.
    //will overwrite values till the loop finishes.
    if(runJack.value == null && largestLeadSuit.value == null){
       // console.log("dont have either leadsuit or a jack to run, in whatsleft.");
        for(let i = 0; i < hand[`p${currentPlayer}Cards`].length; i++){
            if(hand[`p${currentPlayer}Cards`][i].played == false){
                whatsLeft.value = hand[`p${currentPlayer}Cards`][i];
                whatsLeft.index = i;
            }
        }
    }
  //  console.log("what card to play!!");
  //  console.log("largestLeadSuite: " + largestLeadSuit.value);
  //  console.log("largestLeadSuite index: " + largestLeadSuit.index);
  //  console.log("runJack: " + runJack.value);
  //  console.log("runJack index: " + runJack.index);
  //  console.log("whatsleft: " + whatsLeft.value);
  //  console.log("whatsleft index: " + whatsLeft.index);
  //  console.log("determinine index.");

    if(largestLeadSuit.index != null)
        return largestLeadSuit.index;
    if(runJack.index != null)
        return runJack.index;
    return whatsLeft.index;
}
    

async function playHand(){
    let nodeCards = { //make it an object so we can use string interpolation to access the values
        player0Cards: document.querySelectorAll(".player0"),
        player1Cards: document.querySelectorAll(".player1"),
        player2Cards: document.querySelectorAll(".player2"),
        player3Cards: document.querySelectorAll(".player3"),
    }
    while(hand.totalHandsPlayed < 6){ //we are going to play 6 hands 
        while(hand.playHandCounter < 4){ //ever hand 4 cards get played
    //        console.log("hand.indexCurrentPlayer: " + hand.indexCurrentPlayer);
            if(hand.indexCurrentPlayer == 1){//call userHandSetup to allow user to play valid cards
                userHandSetup();
                return;
            }
            let playIndex = whatCardToPlayCPU(hand.indexCurrentPlayer, hand.totalHandsPlayed);
            if(hand.indexCurrentPlayer == 0){
                gsap.to(`.p0c${playIndex}`, {rotation: 270, 
                x:((window.innerWidth-90)/2) - nodeCards.player0Cards[playIndex].getBoundingClientRect().left, 
                y:((window.innerHeight-160)/2)  - nodeCards.player0Cards[playIndex].getBoundingClientRect().top, duration: 1});
            }
            else if(hand.indexCurrentPlayer == 2){
                gsap.to(`.p2c${playIndex}`, {rotation: 270, 
                x:((window.innerWidth-90)/2) -120 - nodeCards.player2Cards[playIndex].getBoundingClientRect().left, 
                y:((window.innerHeight-160)/2) - nodeCards.player2Cards[playIndex].getBoundingClientRect().top, duration: 1});
            }
            else if(hand.indexCurrentPlayer == 3){
                gsap.to(`.p3c${playIndex}`, {rotation: 180, 
                x:(window.innerWidth/2) -100 - nodeCards.player3Cards[playIndex].getBoundingClientRect().left, 
                y: ((window.innerHeight-160)/2) - 80, duration: 1});
            }
            else
                console.log("ERROR line 712 in playhand");
            let obj = {
                card:hand[`p${hand.indexCurrentPlayer}Cards`][playIndex],
                node:nodeCards[`player${hand.indexCurrentPlayer}Cards`][playIndex]
            }
            if(hand.playHandCounter==0) //first one to play start sets the leadSuit
                hand.leadSuit = obj.card.suit;
            hand[`p${hand.indexCurrentPlayer}Cards`][playIndex].played = true; //mark the Card as played
           // console.log(`player# ${hand.indexCurrentPlayer} card: `  + hand[`p${hand.indexCurrentPlayer}Cards`][playIndex]);
            hand.trick.push(obj);
            hand.playHandCounter++
            hand.indexCurrentPlayer++;
            if(hand.indexCurrentPlayer == 4) //for some reason when i did indexstatingpalyer %4 it was inconsistent
                hand.indexCurrentPlayer=0;
            await timer(delay);
        }
        hand.playHandCounter = 0; //Do we need this?????????
        hand.indexCurrentPlayer = determineTrickWinner(hand.trick);//the winner or the hand will leadout on the next  
        //console.log("retured from determine Trick indexCurrentPlayer: " + hand.indexCurrentPlayer);
        hand.totalHandsPlayed++;
    }
}

//passed in is an array of cards and assosiated nodes to track who played what. function determines what player won
//pushes the cards into the correct players trick array for counting up points at the end of the hand.
//this function returns the index of the winning plaer for this trick.
function determineTrickWinner(trickArg){
    console.log("trick");
    let currentLeader; //player index who is winning the trick thus far
    let startingSuitHighValue = ""; //highest value played so far of suit the was led out
    let startingSuit; //suit of the first card played
    let trumpingInSuit = null; //someone can trump in if they dont have the led suit
    let trumpingInHighValue = null; //highest value of trumped in played thus far, more than 1 person can trump in
    for(let i = 0; i < trickArg.length; i++){
        //every card has a player#, suit and value. populate those first
        let player = trickArg[i].node.classList[0][6];
        let value = trickArg[i].card.value;
        let suit = trickArg[i].card.suit;
        if(i == 0){
            currentLeader=player;
            hand.currentHighCard=value;
            startingSuit=suit;
        }
        if(trickArg[i].card.toString() == hand.offJack.toString()){
            console.log("OFFJACK in determine trick winner we can remove");
            console.log(trickArg[i].card.toString());
            suit = hand.trumpSuit;
            if(i == 0)
                startingSuit = hand.trumpSuit;
            value=10.9; //a little weaker than boss jack
        }
        if(trickArg[i].card.value == 20){
            console.log("BUG");
            suit = hand.trumpSuit;
            value=20;
        }
        console.log("suit: " + suit);
        console.log("startingSuit: " + startingSuit);
        if(suit == startingSuit){ //we are of the same suit as what was led. if somone already trumped in skip it
            if(trumpingInSuit == null){
                console.log("same suit, nobody trumped in yet");
                if(value > hand.currentHighCard){
                    currentLeader=player;
                    hand.currentHighCard=value;
                }
            } 
        }
        else if(suit == hand.trumpSuit){ //trumping in
            console.log("trumping in");
            console.log("player: " + player);
            //check if its already been trumped in on
            if(trumpingInSuit == null){ //since they are first to trump they lead now
                trumpingInHighValue = value;
                trumpingInSuit = suit;
                currentLeader=player;
                hand.currentHighCard=null;
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
        console.log("current high card: " + hand.currentHighCard);
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
        hand.p0Trick.push(trickArg);
    }
    if(currentLeader == 1){
        for(let i = 0; i < trickArg.length; i++)
            trickArg[i].node.classList.add("trick1");
        hand.p1Trick.push(trickArg); 
    }
          
    if(currentLeader == 2){
        for(let i = 0; i < trickArg.length; i++)
            trickArg[i].node.classList.add("trick2");
        hand.p2Trick.push(trickArg); 
    }  
    if(currentLeader == 3){
        for(let i = 0; i < trickArg.length; i++)
            trickArg[i].node.classList.add("trick3");
        hand.p3Trick.push(trickArg); 
    }
    hand.trick=[]; //reset the trick
    hand.handsPlayed++;
    hand.leadSuit = null; //reset maybe????????
    console.log("hands played: " + hand.handsPlayed);
    if(hand.handsPlayed == 6)
        tallyGamePoints();
    else
        return currentLeader;
}
function calcHigh(argCard){
    if(argCard.suit == hand.trumpSuit){
        if(argCard.value > hand.currentHighValue){
            hand.currentHighValue = argCard.value;
            return argCard.value;
        }
    }
}
function calcBoss(argCard){
    if(argCard.toString() == hand.bossJack.toString())
        return true;
}
function calcOff(argCard){
    if(argCard.toString() == hand.offJack.toString())
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
    for(let i = 0; i < hand.p0Trick.length; i++){
        for(let j = 0; j < hand.p0Trick[i].length; j++){
            themGew += calcGew(hand.p0Trick[i][j].card.value)
            let possibleHigh = calcHigh(hand.p0Trick[i][j].card);
            if(possibleHigh > high.value){
                high.value = possibleHigh;
                high.player = 0;
            }
            if(calcOff(hand.p0Trick[i][j].card))
                hand.offPlayer = 0;
            if(calcBoss(hand.p0Trick[i][j].card))
                hand.bossPlayer = 0;
            if(calcBug(hand.p0Trick[i][j].card))
                hand.bugPlayer = 0;
        }
    }
    for(let i = 0; i < hand.p1Trick.length; i++){
        for(let j = 0; j < hand.p1Trick[i].length; j++){
            usGew += calcGew(hand.p1Trick[i][j].card.value)
            let possibleHigh = calcHigh(hand.p1Trick[i][j].card);
            if(possibleHigh > high.value){
                high.value = possibleHigh;
                high.player = 1;
            }
            if(calcOff(hand.p1Trick[i][j].card))
                offPlayer = 1;
            if(calcBoss(hand.p1Trick[i][j].card))
                bossPlayer = 1;
            if(calcBug(hand.p1Trick[i][j].card))
                bugPlayer = 1;
        }
    }

    for(let i = 0; i < hand.p2Trick.length; i++){
        for(let j = 0; j < hand.p2Trick[i].length; j++){
            themGew += calcGew(hand.p2Trick[i][j].card.value)
            temp = calcHigh(hand.p2Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 2;
            }
            if(calcOff(hand.p2Trick[i][j].card))
                offPlayer = 2;
            if(calcBoss(hand.p2Trick[i][j].card))
                bossPlayer = 2;
            if(calcBug(hand.p2Trick[i][j].card))
                bugPlayer = 2;
        }
    }

    for(let i = 0; i < hand.p3Trick.length; i++){
        for(let j = 0; j < hand.p3Trick[i].length; j++){
            usGew += calcGew(hand.p3Trick[i][j].card.value)
            temp = calcHigh(hand.p3Trick[i][j].card);
            if(temp > high.value){
                high.value = temp;
                high.player = 3;
            }
            if(calcOff(hand.p3Trick[i][j].card))
                offPlayer = 3;
            if(calcBoss(hand.p3Trick[i][j].card))
                bossPlayer = 3;
            if(calcBug(hand.p3Trick[i][j].card))
                bugPlayer = 3;
        }
    }   
    //display calulations
    if(usGew > themGew){
        document.getElementById("gewUs").innerText = 1;
        hand.usScore += 1;
    }
    else{
        document.getElementById("gewThem").innerText = 1;
        hand.themScore += 1;
    }
    if(high.player == 0 || high.player == 2){
        document.getElementById("highThem").innerText = 1;
        hand.themScore += 1;
    }   
    else{
        document.getElementById("highUs").innerText = 1;
        hand.usScore += 1;
    }
        
    if(offPlayer == 0 || offPlayer == 2){
        document.getElementById("offThem").innerText = 1;
        hand.themScore += 1;
    }
    if(offPlayer == 1 || offPlayer == 3){
        document.getElementById("offUs").innerText = 1;
        hand.usScore += 1;
    }
    if(bossPlayer == 0 || bossPlayer == 2){
        document.getElementById("bossThem").innerText = 1;
        hand.themScore += 1;
    }
    if(bossPlayer == 1 || bossPlayer == 3){
        document.getElementById("bossUs").innerText = 1;
        hand.usScore += 1;
    }
        
    if(bugPlayer == 0 || bugPlayer == 2){
        document.getElementById("bugThem").innerText = 1;
        hand.themScore += 1;
    }
        
    if(bugPlayer == 1 || bugPlayer == 3){
        document.getElementById("bugUs").innerText = 1;
        hand.usScore += 1;
    }
        
    if(hand.lowPlayer == 0 || hand.lowPlayer == 2){
        document.getElementById("lowThem").innerText = 1;
        hand.themScore += 1;
    }
        
    if(hand.lowPlayer == 1 || hand.lowPlayer == 3){
        document.getElementById("lowUs").innerText = 1;
        hand.usScore += 1;
    }
    //update scoreboard    
    let indexWinningBidder = game.dealerOrder.indexOf(hand.winningBidder);
    if(indexWinningBidder == 0 || indexWinningBidder == 2){
        if(hand.themScore < hand.currentHighBid){ //this hand bad guys got set
            document.getElementById("gameOverMessage").innerText = `bad guys got set backwards for ${hand.currentHighBid}`;
            hand.themScore = hand.currentHighBid - hand.currentHighBid - hand.currentHighBid;
        }
        else{ //the bad guys bid and got their bid hand.themScore is good the way it is
            document.getElementById("gameOverMessage").innerText = "bad guys won the hand";
        }
    }
    else{
        if(hand.usScore< hand.currentHighBid){ //this hand the good guys got set
            document.getElementById("gameOverMessage").innerText = `good guys got set backwards for ${hand.currentHighBid}`;
            hand.usScore = hand.currentHighBid - hand.currentHighBid - hand.currentHighBid;
        }
        else
            document.getElementById("gameOverMessage").innerText = "good guys won the hand";
    }
    game.themScoreTotal += hand.themScore;
    game.usScoreTotal += hand.usScore;;
    document.getElementById("scoreGoodGuys").innerText = game.usScoreTotal;
    document.getElementById("scoreBadGuys").innerText = game.themScoreTotal;
    //end of game logic
    if(game.usScoreTotal > 20 || game.themScoreTotal > 20){ //game is over. we need to check for Staubs case bidder wins if both go out
        if(game.usScoreTotal > 20 && game.themScoreTotal > 20){ //the bidder wins
            if(hand.indexWinningBidder == 1 || hand.indexWinningBidder == 3)
                alert("Good guys won the Game!!! STAUBS!!!");
            else
                alert("Bad guys won the Game!!! STAUBS!!!!!");
        }
        else{ //only 1 player went out print who it is
            if(game.usScoreTotal > 20)
                alert("good Guys win it again!!");
            else  
                alert("Bad Guys win it booooo!!");
        }
        //reset the usScore and themscore
        //game.usScoreTotal = 0;
        //themScore = 0;
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
    document.getElementById("gameOverMessage").innerText = "";
    let gameEndValClass = document.querySelectorAll(".gameEndVal");
    for(let i = 0; i < gameEndValClass.length; i++)
        gameEndValClass[i].innerText = "--";
    let gameValueClass = document.querySelectorAll(".gameValue");
   for(let i = 0; i < gameValueClass.length; i++)
        gameValueClass[i].innerText = "--";
    let bidClass = document.querySelectorAll(".bid");
    for(let i = 0; i < bidClass.length; i++)
        bidClass[i].innerText = "--";
    document.getElementById("dealerValue").innerText=game.dealerOrder[game.currentDealerIndex];
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
        for(let i = 0; i < obj[`p${j}`].length; i++)
            obj[`p${j}`][i].remove();
    }

    game.currentDealerIndex++;
    game.currentBidderIndex = game.currentDealerIndex + 1;
    if(game.currentBidderIndex == 4)
        game.currentBidderIndex = 0;
    document.getElementById("dealerValue").innerText=game.dealerOrder[game.currentDealerIndex];
    hand.reset();
    startGame();
}