let btns = document.querySelectorAll(".btn");
let shiftedDown = [false,false,false];
document.querySelector(".done").addEventListener("click", () =>{
    console.log("all done here");
    console.log(shiftedDown);
})
shiftDown();

//we need a stopping condition. 
function shiftDown(){
   // while(changed){
        for(let i = 0; i < btns.length; i++){
            if(shiftedDown[i] == false){
                btns[i].addEventListener("click", () => {
                    btns[i].classList.add("moveDown");
                    btns[i].classList.remove("moveUp");
                    console.log("clicked it");
                    shiftedDown[i] = true;
                    console.log(shiftedDown);
                    shiftUp();
                });
            }
        }
    //}
}
function shiftUp(){
    for(let i = 0; i < btns.length; i++){
        if(shiftedDown[i] == true){
            btns[i].addEventListener("click", () => {
                btns[i].classList.remove("moveDown");
                btns[i].classList.add("moveUp");
                console.log("clicked it back up");
                shiftedDown[i] = false;
                console.log(shiftedDown);
                shiftDown();
            });
        }
    }
}

