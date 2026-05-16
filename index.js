import 'dotenv/config'
import express, { request } from "express"
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
})

function todaysMatchesFilter(obj) {
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
}

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
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",async (req, res) => {
  try{
    const standingsRequest = await api.get("/competitions/PL/standings");
    const standingsResponse = standingsRequest.data.standings[0].table;

    const todaysMatchesRequest = await api.get("/competitions/PL/matches",{params:{dateFrom: testDate, dateTo: testDate}});
    const todaysMatchesResponse = todaysMatchesRequest.data.matches;

    res.render("index.ejs", {
      todaysMatches: JSON.stringify(todaysMatchesResponse.map(todaysMatchesFilter)),
      standings: JSON.stringify(standingsResponse.map(standingsFilter))
    });

  }catch(error){
    console.log(error.message);
  };
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});