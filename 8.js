import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const [dirs, ...rest] = inp.split("\n")
const directions = [...dirs].map(e => e == "L" ? 0 : 1);
const map = JSON.parse(
  "{" +
  rest.join("")
    .replace(/(\w+)/gm, '"$1"')
    .replaceAll("=", ":")
    .replaceAll("(", "[")
    .replaceAll(")", "],")
    .slice(0, -1) +
  "}"
);

let location = "AAA";

function getTotalSteps(acc = 1) {
  let i = acc;
  for (let dir of directions) {
    location = map[location][dir];
    if (location == "ZZZ") {
      console.log({ steps: i })
      return i;
    }
    i++;
  }
  return getTotalSteps(i);
}

getTotalSteps();