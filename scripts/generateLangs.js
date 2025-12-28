import fs from "fs";
import fetch from "node-fetch";

const username = "im-divxnshh";

async function getRepos() {
  return (await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)).json();
}

async function main() {
  const repos = await getRepos();

  const counter = {};
  repos.forEach(r => {
    if (r.language) counter[r.language] = (counter[r.language] || 0) + 1;
  });

  const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]).slice(0, 6);

  let y = 120;
  let rows = "";

  sorted.forEach(([lang, count]) => {
    rows += `
      <text x="40" y="${y}" fill="#fffde7" font-size="24">${lang}</text>
      <rect x="220" y="${y - 22}" width="${count * 60}" height="20" rx="5"
       fill="url(#zenitsu)" filter="url(#glow)"/>
    `;
    y += 50;
  });

  const svg = `
<svg width="820" height="330" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <linearGradient id="zenitsu" x1="0" x2="1">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="100%" stop-color="#ffd633"/>
    </linearGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" rx="18" fill="#0a0a0a" stroke="#ffdf46"
        stroke-width="3" filter="url(#glow)"/>

  <text x="40" y="70" fill="#ffdf46" font-size="36" font-weight="900" filter="url(#glow)">
    ⚡ Thunder Mode — Top Languages
  </text>

  ${rows}

</svg>`;

  fs.writeFileSync("./svg/langs.svg", svg);
  console.log("⚡ langs card updated");
}

main();
