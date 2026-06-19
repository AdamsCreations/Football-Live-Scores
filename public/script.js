function parseTodaysMatchesJSON(jsonResponse) {
  document
    .querySelectorAll(".todays-matches-item")
    .forEach((item) => item.remove());
  jsonResponse.forEach((match) => {
    const matchCard = document.createElement("li");
    matchCard.classList.add("todays-matches-item");
    matchCard.classList.add("match-card");
    matchCard.classList.add(match.status);
    document.getElementById("todays-matches").appendChild(matchCard);

    const time = matchCard.appendChild(document.createElement("p"));
    time.classList.add("time");

    const homeTeamCrest = matchCard.appendChild(document.createElement("img"));
    homeTeamCrest.classList.add("homeTeamCrest");

    const homeTeamName = matchCard.appendChild(document.createElement("p"));
    homeTeamName.classList.add("homeTeamName");

    const homeTeamScore = matchCard.appendChild(document.createElement("p"));
    homeTeamScore.classList.add("homeTeamScore");

    const awayTeamCrest = matchCard.appendChild(document.createElement("img"));
    awayTeamCrest.classList.add("awayTeamCrest");

    const awayTeamName = matchCard.appendChild(document.createElement("p"));
    awayTeamName.classList.add("awayTeamName");

    const awayTeamScore = matchCard.appendChild(document.createElement("p"));
    awayTeamScore.classList.add("awayTeamScore");

    time.innerText = new Date(match.utcDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    homeTeamCrest.setAttribute("src", match.homeTeamCrest);
    homeTeamName.innerText = match.homeTeamName;
    homeTeamScore.innerText = match.homeScore;
    awayTeamCrest.setAttribute("src", match.awayTeamCrest);
    awayTeamName.innerText = match.awayTeamName;
    awayTeamScore.innerText = match.awayScore;
  });
}

function parseStandingsJSON(jsonResponse) {
  document.querySelectorAll(".standings-item").forEach((item) => item.remove());
  jsonResponse.forEach((team) => {
    const teamCard = document.createElement("li");
    teamCard.classList.add("standings-item");
    document.getElementById("standings").appendChild(teamCard);

    const crest = teamCard.appendChild(document.createElement("img"));
    crest.classList.add("crest");

    const position = teamCard.appendChild(document.createElement("p"));
    position.classList.add("position");

    const name = teamCard.appendChild(document.createElement("p"));
    name.classList.add("name");

    const played = teamCard.appendChild(document.createElement("p"));
    played.classList.add("played");

    const won = teamCard.appendChild(document.createElement("p"));
    won.classList.add("won");

    const draw = teamCard.appendChild(document.createElement("p"));
    draw.classList.add("draw");

    const lost = teamCard.appendChild(document.createElement("p"));
    lost.classList.add("lost");

    const goalsFor = teamCard.appendChild(document.createElement("p"));
    goalsFor.classList.add("goalsFor");

    const goalsAgainst = teamCard.appendChild(document.createElement("p"));
    goalsAgainst.classList.add("goalsAgainst");

    const goalDifference = teamCard.appendChild(document.createElement("p"));
    goalDifference.classList.add("goalDifference");

    const points = teamCard.appendChild(document.createElement("p"));
    points.classList.add("points");

    crest.setAttribute("src", team.crest);
    position.innerText = team.position;
    name.innerText = team.team;
    played.innerText = team.playedGames;
    won.innerText = team.won;
    draw.innerText = team.draw;
    lost.innerText = team.lost;
    goalsFor.innerText = team.goalsFor;
    goalsAgainst.innerText = team.goalsAgainst;
    goalDifference.innerText = team.goalDifference;
    points.innerText = team.points;
  });
}

async function getTodaysMatches() {
  try {
    const request = await fetch("/todaysMatches", {
      headers: { "x-localDate": new Date().toLocaleDateString("en-CA") },
    });
    const response = await request.json();
    parseTodaysMatchesJSON(response);
  } catch (error) {
    console.log(error);
  }
}

async function getFixtures() {
  try {
    const request = await fetch("/fixtures", {
      headers: { "x-localDate": new Date().toLocaleDateString("en-CA") },
    });
    const response = await request.json();
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function getResults() {
  try {
    const request = await fetch("/results", {
      headers: { "x-localDate": new Date().toLocaleDateString("en-CA") },
    });
    const response = await request.json();
    console.log(response);
    parseResults(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function getStandings() {
  try {
    const request = await fetch("/standings");
    const response = await request.json();
    console.log(Array.isArray(response));
    parseStandingsJSON(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function getTopGoalScorers() {
  try {
    const request = await fetch("/topGoalScorers");
    const response = await request.json();
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
}

getTodaysMatches();
setInterval(getTodaysMatches, 60000);
setInterval(getStandings, 60000);

document
  .getElementById("todays-matches-btn")
  .addEventListener("click", getTodaysMatches);

document.getElementById("fixtures-btn").addEventListener("click", getFixtures);

document.getElementById("results-btn").addEventListener("click", getResults);

document
  .getElementById("standings-btn")
  .addEventListener("click", getStandings);

document
  .getElementById("top-goal-scorers")
  .addEventListener("click", getTopGoalScorers);
