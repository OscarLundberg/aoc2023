import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");

const mapNames = ["soil", "fertilizer", "water", "light", "temperature", "humidity", "location"]
const seeds = inp.match(/seeds:(.*)/)[1].trim().split(/\s/).map(e => parseInt(e))
let allMaps = [];

const maps = inp.matchAll(/map:((?:\d|\s)+)/gms);
for (let match of maps) {
  const lines = match[1].split("\n").filter(e => e)
  const ranges = lines.map(l =>
    l.split(/\s/)
      .map(e =>
        parseInt(e.trim())
      )
  ).map(([target, src, len]) => ({ target, src, len }))
  allMaps = [...allMaps, ranges]
}

function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


function mapNumber(n, { target, src, len }) {
  return scale(n, src, src + len, target, target + len)
}

function inRange(n, { target, src, len }) {
  return (n >= src && n <= src + len)
}

function mapAll(n) {
  let mappedN = n;
  let i = 0;
  for (let map of allMaps) {
    console.log(mapNames[i])
    const range = map.find(e => inRange(mappedN, e));
    if (range) {
      mappedN = mapNumber(mappedN, range)
    }
    console.log(mappedN)
    i++;
  }
  return mappedN;
}

let lowest = Infinity;
for (let seed of seeds) {
  lowest = Math.min(lowest, mapAll(seed));
}

console.log({ lowest })




