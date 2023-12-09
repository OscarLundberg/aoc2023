import fs from "fs";
// 12315788159977

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

function getStepsFromLocationToLocation(from, to) {
  let location = from;
  function getTotalSteps(acc = 1) {
    let i = acc;
    for (let dir of directions) {
      location = map[location][dir];
      if (location == to) {
        return i;
      }
      i++;
    }
    return getTotalSteps(i);
  }
  try {
    return getTotalSteps();
  } catch (err) {
    return Infinity;
  }
}


const startLocations = Object.keys(map).filter(e => e.endsWith("A"));
const endLocations = Object.keys(map).filter(e => e.endsWith("Z"));
const stepsToZ = startLocations.reduce((prev, start) => ({
  ...prev,
  [start]: endLocations
    .map(end => getStepsFromLocationToLocation(start, end))
    .find((steps) => steps < Infinity)
}), {});

function gcd(a, b) {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(arr) {
  let out = arr[0];
  for (let i = 1; i < arr.length; i++) {
    out = (arr[i] * out) / gcd(arr[i], out);
  }
  return out;
}

const nums = Object.values(stepsToZ);
const r = lcm(nums);
console.log(r)