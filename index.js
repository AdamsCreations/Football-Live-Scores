import "dotenv/config";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { getCache } from "./cache.js";
import { setCache } from "./cache.js";

const app = express();
const port = 3000;
const today = new Date().toISOString().split("T")[0];
const testDate = "2026-04-12";
const api = axios.create({
  baseURL: "http://api.football-data.org/v4",
  headers: {
    "X-Auth-Token": process.env.FD_API_KEY,
  },
});

function matchesFilter(obj) {
  return {
    utcDate: obj.utcDate,
    status: obj.status,
    matchday: obj.matchday,
    homeTeamName: obj.homeTeam.shortName,
    homeTeamCrest: obj.homeTeam.crest,
    awayTeamName: obj.awayTeam.shortName,
    awayTeamCrest: obj.awayTeam.crest,
    homeScore: obj.score.fullTime.home ?? "",
    awayScore: obj.score.fullTime.away ?? "",
  };
}

function standingsFilter(obj) {
  return {
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
    goalDifference: obj.goalDifference,
  };
}

function topGoalScorersFilter(obj) {
  return {
    playerName: obj.player.name,
    teamName: obj.team.shortName,
    teamCrest: obj.team.crest,
    goals: obj.goals,
    penalties: obj.penalties ?? 0,
  };
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  console.log("GET /");
  try {
    console.log("server get cache");
    const cache = getCache("standings");
    if (cache) {
      console.log("cache is available");
      res.render("index.ejs", { standings: JSON.stringify(cache.data) });
    } else {
      const standingsRequest = await api.get("/competitions/PL/standings");
      const standingsResponse = standingsRequest.data.standings[0].table;
      const data = standingsResponse.map(standingsFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("standings", data, Date.now());
      res.render("index.ejs", { standings: JSON.stringify(data) });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/todaysMatches", async (req, res) => {
  try {
    const cache = getCache("todays-matches");
    if (cache) {
      console.log("cache is available");
      res.json(cache.data);
    } else {
      const localDate = req.headers["x-localDate"] || today;
      const matchesRequest = await api.get("/competitions/PL/matches", {
        params: { dateFrom: testDate, dateTo: testDate },
      });
      const matchesResponse = matchesRequest.data.matches;
      const data = matchesResponse.map(matchesFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("todays-matches", data, Date.now());
      res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/fixtures", async (req, res) => {
  try {
    const cache = getCache("fixtures");
    if (cache) {
      console.log("cache is available");
      res.json(cache.data);
    } else {
      const matchesRequest = await api.get("/competitions/PL/matches", {
        params: { status: "SCHEDULED" },
      });
      const matchesResponse = matchesRequest.data.matches;
      const data = matchesResponse.map(matchesFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("fixtures", data, Date.now());
      res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/results", async (req, res) => {
  try {
    const cache = getCache("results");
    if (cache) {
      console.log("cache is available");
      res.json(cache.data);
    } else {
      const matchesRequest = await api.get("/competitions/PL/matches", {
        params: { status: "FINISHED" },
      });
      const matchesResponse = matchesRequest.data.matches;
      const data = matchesResponse.map(matchesFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("results", data, Date.now());
      res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/standings", async (req, res) => {
  try {
    const cache = getCache("standings");
    if (cache) {
      console.log("cache is available");
      res.json(cache.data);
    } else {
      const standingsRequest = await api.get("/competitions/PL/standings");
      const standingsResponse = standingsRequest.data.standings[0].table;
      const data = standingsResponse.map(standingsFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("standings", data, Date.now());
      res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/topGoalScorers", async (req, res) => {
  try {
    const cache = getCache("top-goal-scorers");
    if (cache) {
      console.log("cache is available");
      res.json(cache.data);
    } else {
      const topGoalScorersRequest = await api.get("/competitions/PL/scorers");
      const topGoalScorersResponse = topGoalScorersRequest.data.scorers;
      const data = topGoalScorersResponse.map(topGoalScorersFilter);
      console.log("no cache");
      console.log("server set cache");
      setCache("top-goal-scorers", data, Date.now());
      res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
