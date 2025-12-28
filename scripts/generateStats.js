import fetch from "node-fetch";
import fs from "fs";

const username = "im-divxnshh";

async function getUser() {
  const res = await fetch(`https://api.github.com/users/${username}`);
  return res.json();
}

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  return res.json();
}

async function main() {
  const user = await getUser();
  const repos = await getRepos();

  let stars = 0;
  repos.forEach(r => stars += r.stargazers_count);

  const svg = `
<svg width="700" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#0b1f0b" stroke="#00ff62" stroke-width="3"/>

  <text x="40" y="50" fill="#00ff62" font-size="30" font-weight="bold">
    ${user.name}'s GitHub Stats
  </text>

  <text x="40" y="100" fill="#c2ffd5" font-size="22">
    ⭐ Total Stars: ${stars}
  </text>

  <text x="40" y="140" fill="#c2ffd5" font-size="22">
    📦 Public Repos: ${user.public_repos}
  </text>

  <text x="350" y="100" fill="#c2ffd5" font-size="22">
    👥 Followers: ${user.followers}
  </text>

  <text x="350" y="140" fill="#c2ffd5" font-size="22">
    🔁 Following: ${user.following}
  </text>
</svg>`;

  fs.writeFileSync("./svg/stats.svg", svg);
  console.log("Stats Card Updated!");
}

main();
