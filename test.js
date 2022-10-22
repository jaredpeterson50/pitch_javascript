
/*width of 100 height 146 for card.  to center on x we need window.innerwidth - */
let test = document.querySelector(".p0c0");
//console.log(test.getBoundingClientRect().left);
//console.log(window.innerWidth);
//console.log("height");
//console.log(window.innerHeight);

//console.log((window.innerHeight/2)-70);
//console.log(test.getBoundingClientRect().top);

let p0 = document.querySelectorAll(".player0");
for(let i = 0; i < p0.length; i++){
    p0[i].addEventListener("click", () =>{
        gsap.to(`.p0c${i}`, {rotation: 270, x:(window.innerWidth/2)-70 - p0[i].getBoundingClientRect().left, 
        y: (window.innerHeight/2) - 110 - p0[i].getBoundingClientRect().top, duration: 1});
    })
}
let p1 = document.querySelectorAll(".player1");
for(let i = 0; i < p1.length; i++){
    p1[i].addEventListener("click", () =>{
        gsap.to(`.p1c${i}`, {rotation: 180, x:(window.innerWidth/2)-75 - p1[i].getBoundingClientRect().left, 
        y: (window.innerHeight/2) - 50 - p1[i].getBoundingClientRect().top, duration: 1});
    })
}
let p2 = document.querySelectorAll(".player2");
for(let i = 0; i < p2.length; i++){
    p2[i].addEventListener("click", () =>{
        gsap.to(`.p2c${i}`, {rotation: 270, x:(window.innerWidth/2)-140 - p2[i].getBoundingClientRect().left, 
        y: (window.innerHeight/2) - 110 - p2[i].getBoundingClientRect().top, duration: 1});
    })
}
let p3 = document.querySelectorAll(".player3");
for(let i = 0; i < p3.length; i++){
    p3[i].addEventListener("click", () =>{
        gsap.to(`.p3c${i}`, {rotation: 180, x:(window.innerWidth/2)-75 - p3[i].getBoundingClientRect().left, 
        y: (window.innerHeight-130)/2-100 - p3[i].getBoundingClientRect().top, duration: 1});
        console.log("player3");
        console.log(window.innerHeight);
        console.log(p3[i].getBoundingClientRect().top);
        console.log("left: " + p3[i].getBoundingClientRect().left);
        console.log("the X: " + p3[i].getBoundingClientRect().x);
        console.log("the y: " + p3[i].getBoundingClientRect().y);
    })
}