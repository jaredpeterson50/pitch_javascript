//declare and set defaults
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
var game = {
    dealer:"west",
    bidder:"south",
    currentBid:"--",
    us:0,
    them:0
}
var playerMap = {
    south:0,
    north:1,
    west:2,
    east:3
}
/*start the bidding until south gets a turn then wait for user input... then continue the bidding
we need to loop through every player so 4 bids. can you boolean flags or a loop of length 4 either way
we need a looop. wait for the condition of west bidCompleted to be true for loop to stop and wait for south
to bid.*/


var bidOrder = ["west", "south", "east", "north"];
var currentDealer = 0;
var bidCounter = dealCounter + 1; //first bidder is the right of dealer

for(let i = 0; i < 4; i++){
    if(west.bidYet==='true'){
        console.log("wait for south to bid.")
        console.log("event! player south bid 2");
    }
    else{
        console.log("current bidder: " + bidOrder[bidCounter%4]); //%4 to prevent overflow of array
        
    }
}


north.bidAmt=2;
