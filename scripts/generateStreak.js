import fs from "fs";
import fetch from "node-fetch";

const username = "im-divxnshh";

async function getContributions() {
  const query = `
  query {
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  if (!json.data?.user) return null;
  return json.data.user.contributionsCollection.contributionCalendar.weeks;
}

function calculateStreak(weeks) {
  let streak = 0;
  let best = 0;

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        streak++;
        best = Math.max(best, streak);
      } else streak = 0;
    }
  }

  return { streak, best };
}

async function main() {
  const weeks = await getContributions();
  const { streak, best } = calculateStreak(weeks);

  const svg = `
<svg width="820" height="250" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <radialGradient id="gojo">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="60%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>

    <linearGradient id="zenitsu" x1="0" x2="1">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="100%" stop-color="#ffdd33"/>
    </linearGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" rx="18" fill="#0a0a0a"
        stroke="url(#zenitsu)" stroke-width="3" filter="url(#glow)"/>

  <text x="40" y="70" fill="url(#zenitsu)" font-size="34" font-weight="900" filter="url(#glow)">
    ⚡ Thunder Breathing × Infinity — Streak
  </text>

  <g font-size="26" font-family="monospace" fill="#fff7d6">
    <text x="40" y="130">Current Streak: <tspan fill="#ffdd33">${streak} days</tspan></text>
    <text x="40" y="175">Best Streak: <tspan fill="#ffdd33">${best} days</tspan></text>
  </g>

</svg>
`;

  fs.writeFileSync("./svg/streak.svg", svg);
  console.log("⚡ streak card updated");
}

main();
