
console.log(document.getElementById("fixtures-btn"));

document.getElementById("todays-matches-btn").addEventListener("click",async () => {
    try{
        const request = await fetch("/fixtures");
        const response = await request.json();
        console.log(response); 
    }catch(error){
        console.log(error.message);
    };
})

document.getElementById("fixtures-btn").addEventListener("click",async  () => {
    try{
        const request = await fetch("/fixtures");
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error.message);
    };

})

document.getElementById("results-btn").addEventListener("click",async () =>{
    try{
        const request = await fetch("/results");
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error.message);
    };
})

document.getElementById("standings-btn").addEventListener("click",async () =>{
    try{
        const request = await fetch("/standings");
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error.message);
    };
});

document.getElementById("top-goal-scorers").addEventListener("click",async () =>{
    try{
        const request = await fetch("/topGoalScorers");
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error.message);
    };
})
