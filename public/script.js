
async function getTodaysMatches () {
    try{
        const request = await fetch("/todaysMatches",{headers: {"x-localDate": new Date().toLocaleDateString('en-CA')}});
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error)
    };
};

getTodaysMatches();

document.getElementById("todays-matches-btn").addEventListener("click",async () => {
    try{
        const request = await fetch("/todaysMatches",{headers: {"x-localDate": new Date().toLocaleDateString('en-CA')}});
        const response = await request.json();
        console.log(response); 
    }catch(error){
        console.log(error.message);
    };
})

document.getElementById("fixtures-btn").addEventListener("click",async  () => {
    try{
        const request = await fetch("/fixtures",{headers: {"x-localDate": new Date().toLocaleDateString('en-CA')}});
        const response = await request.json();
        console.log(response);
    }catch(error){
        console.log(error.message);
    };

})

document.getElementById("results-btn").addEventListener("click",async () =>{
    try{
        const request = await fetch("/results",{headers: {"x-localDate": new Date().toLocaleDateString('en-CA')}});
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
