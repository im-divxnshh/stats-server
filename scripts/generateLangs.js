import fetch from "node-fetch";
import fs from "fs";

const username = "im-divxnshh";

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  return res.json();
}

async function main() {
  const repos = await getRepos();
  let langs = {};

  for (const r of repos) {
    if (!r.language) continue;
    langs[r.language] = (langs[r.language] || 0) + 1;
  }

  let sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);

  let bars = "";
  let y = 90;

  sorted.forEach(([lang, count]) => {
    bars += `
    <text x="40" y="${y}" fill="#c2ffd5" font-size="20">${lang}</text>
    <rect x="200" y="${y - 15}" width="${count * 50}" height="20" fill="#00ff62" rx="5"/>
    `;
    y += 40;
  });

  const svg = `
<svg width="700" height="260" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#0b1f0b" stroke="#00ff62" stroke-width="3"/>

  <text x="40" y="50" fill="#00ff62" font-size="30" font-weight="bold">
    Top Languages
  </text>

  ${bars}
</svg>
`;

  fs.writeFileSync("./svg/langs.svg", svg);
  console.log("Languages Card Updated!");
}

main();
