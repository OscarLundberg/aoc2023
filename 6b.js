import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const [time, distance] = inp.split("\n");
const times = time.split(/\s+/).map(e => parseInt(e.trim())).filter(e => e)
const distances = distance.split(/\s+/).map(e => parseInt(e.trim())).filter(e => e)
let races = [];
for (let i = 0; i < times.length; i++) {
  races = [...races, {
    time: times[i],
    dist: distances[i]
  }]
}

function getWinningMoves(race) {
  let chargeMoves = 0;
  for (let i = 0; i < race.time; i++) {
    if (i % 10000 == 0) { 
      console.log({ status: `${i} / ${race.time}`  }) 
    }
    if (i * (race.time - i) > race.dist) {
      chargeMoves += 1;
    }
  }
  return chargeMoves
}

const sum = races.reduce((prev, cur) => getWinningMoves(cur) * prev, 1);
console.log(sum)