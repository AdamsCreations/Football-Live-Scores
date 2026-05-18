import 'dotenv/config';
import express, { request, response } from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const today = new Date().toISOString().split('T')[0]; // "2026-05-15"
const testDate = "2026-05-18"
const api = axios.create({
  baseURL: "http://api.football-data.org/v4",
  headers:{
    "X-Auth-Token": process.env.FD_API_KEY
  }
});

function matchesFilter(obj){
  return {
    utcDate: obj.utcDate,
    status: obj.status,
    homeTeamName: obj.homeTeam.shortName,
    homeTeamCrest: obj.homeTeam.crest,
    awayTeamName: obj.awayTeam.shortName,
    awayTeamCrest: obj.awayTeam.crest,
    homeScore: obj.score.fullTime.home,
    awayScore: obj.score.fullTime.away,
  }
};

function standingsFilter(obj){
  return{
    position: obj.position,
    team: obj.team.name,
    crest: obj.team.crest,
    playedGames: obj.playedGames,
    won: obj.won,
    draw: obj.draw,
    lost: obj.lost,
    points: obj.points,
    goalsFor: obj.goalsFor,
    goalsAgainst: obj.goalsAgainst,
    goalDifference: obj.goalDifference
  }
};

function topGoalScorersFilter(obj){
  return{
    playerName: obj.player.name,
    teamName: obj.team.shortName,
    teamCrest: obj.team.crest,
    goals: obj.goals,
    penalties: obj.penalties??0
  }
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",async (req, res) => {
  try{
    const matchesRequest = await api.get("/competitions/PL/matches",{params:{dateFrom: today, dateTo: today}});
    const matchesResponse = matchesRequest.data.matches;

    const standingsRequest = await api.get("/competitions/PL/standings");
    const standingsResponse = standingsRequest.data.standings[0].table;

    res.render("index.ejs", {
      todaysMatches: JSON.stringify(matchesResponse.map(matchesFilter)),
      standings: JSON.stringify(standingsResponse.map(standingsFilter))
    });

  }catch(error){
    console.log(error.message);
  };

});

app.get("/todaysMatches",async (req, res) =>{
  try{
    const matchesRequest = await api.get("/competitions/PL/matches",{params:{dateFrom: today, dateTo: today}});
    const matchesResponse = matchesRequest.data.matches;

    res.json(matchesResponse.map(matchesFilter));
  }catch(error){

  };
})

app.get("/fixtures",async (req, res) => {
  try{
    const matchesRequest = await api.get("/competitions/PL/matches",{params:{status: "SCHEDULED"}});
    const matchesResponse = matchesRequest.data.matches;
    console.log(matchesResponse.map(matchesFilter))
    res.json(matchesResponse.map(matchesFilter));
  }catch(error){
    console.log(error.message);
  };
});

app.get("/results",async (req, res) => {
  try{
    const matchesRequest = await api.get("/competitions/PL/matches",{params:{status: "FINISHED"}});
    const matchesResponse = matchesRequest.data.matches;

    res.json(matchesResponse.map(matchesFilter));

  }catch(error){
    console.log(error.message);
  };
});

app.get("/standings",async (req, res) => {
  try{
    const standingsRequest = await api.get("/competitions/PL/standings");
    const standingsResponse = standingsRequest.data.standings[0].table;

    res.json(standingsResponse.map(standingsFilter));
  }catch(error){

  };
})

app.get("/topGoalScorers",async (req, res) =>{
  try{
    const topGoalScorersRequest = await api.get("/competitions/PL/scorers");
    const topGoalScorersResponse = topGoalScorersRequest.data.scorers;

    res.json(topGoalScorersResponse.map(topGoalScorersFilter))

  }catch(error){
    console.log(error.message);
  };
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});