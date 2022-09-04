var timer = ms => new Promise(res => setTimeout(res, ms))
var delay = 1000;
var indexStartingPlayer = 2;
testFunc();
async function testFunc(){
    for(let i = 0; i < 10; i ++){
        console.log("before: " + indexStartingPlayer);
        indexStartingPlayer = (indexStartingPlayer + 1) % 4;
        console.log("ready to re loop");
        console.log("index starting player: " +indexStartingPlayer);
        await timer(1500);
    }
}

