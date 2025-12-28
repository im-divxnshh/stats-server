import fetch from "node-fetch";
import fs from "fs";

const username = "im-divxnshh";

async function getContributions() {
  const query = `
  query {
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
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
      Authorization: "bearer ${process.env.GH_TOKEN}"
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  return json.data.user.contributionsCollection.contributionCalendar.weeks;
}

function calcStreak(weeks) {
  let streak = 0;
  let best = 0;

  for (const w of weeks) {
    for (const d of w.contributionDays) {
      if (d.contributionCount > 0) {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    }
  }

  return { streak, best };
}

async function main() {
  const weeks = await getContributions();
  const { streak, best } = calcStreak(weeks);

  const svg = `
<svg width="700" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#0b1f0b" stroke="#00ff62" stroke-width="3"/>
  <text x="40" y="50" fill="#00ff62" font-size="30" font-weight="bold">🔥 GitHub Streak</text>

  <text x="40" y="110" fill="#c2ffd5" font-size="22">Current Streak: ${streak} days</text>
  <text x="40" y="150" fill="#c2ffd5" font-size="22">Best Streak: ${best} days</text>
</svg>
`;

  fs.writeFileSync("./svg/streak.svg", svg);
  console.log("Streak Card Updated!");
}

main();
