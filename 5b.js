import fs from "fs";

// 869299388
// 74903218
// 74903217
// 74903215 TOO HIGH
// 47816
// 1176
// 5206
// 204

const SAMPLES = 5500;

const inp = fs.readFileSync("./input.txt", "utf-8");

const mapNames = ["soil", "fertilizer", "water", "light", "temperature", "humidity", "location"]
const seedRow = inp.match(/seeds:(.*)/)[1].trim().split(/\s/).map(e => parseInt(e))
let inputRanges = [];
for (let i = 0; i < seedRow.length; i += 2) {
  inputRanges = [
    ...inputRanges,
    {
      src: seedRow[i],
      len: seedRow[i + 1]
    }
  ]
}
let allMapsReversed = [];

const maps = inp.matchAll(/map:((?:\d|\s)+)/gms);
for (let match of maps) {
  const lines = match[1].split("\n").filter(e => e)
  const ranges = lines.map(l =>
    l.split(/\s/)
      .map(e =>
        parseInt(e.trim())
      )
  ).map(([target, src, len]) => ({ target, src, len }))
  allMapsReversed = [...allMapsReversed, ranges]
}
allMapsReversed.reverse();

function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function existsInInput(n) {

  return inputRanges.some(e => e.src <= n && (e.src + e.len) >= n)
}

function mapReverse(targetValue, ranges) {
  const range = ranges.find(e => e.target <= targetValue && (e.target + e.len) >= targetValue)
  if (!range) return targetValue;

  return scale(
    targetValue,
    range.target, range.target + range.len,
    range.src, range.src + range.len
  );
}

function reverseMap(n) {
  let value = n;
  for (let map of allMapsReversed) {
    value = mapReverse(value, map)
  }
  return value;
}

for (let i = 0; i < 1000000000; i++) {
  const reversed = reverseMap(i);

  if (existsInInput(reversed)) {
    console.log({ i })
    break;
  }
}
console.log("Done")