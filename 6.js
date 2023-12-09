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

const hashBoat = (b) => `${b.velocity}-${b.distance}-${b.time}`;

const createBoat = (time) => ({
  velocity: 0,
  distance: 0,
  time
});

let seen = {}

function hasSeenBoat(b){
  const hash = hashBoat(b);
  if(Reflect.has(seen, hash)){
    return true;
  }
  return false;
}

function charge(b) {
  return {
    ...b,
    velocity: b.velocity + 1,
    time: b.time - 1
  }
}

function coast(b) {
  const totalDistance = b.velocity * b.time;
  return totalDistance
}

function chargeMove(d, race) {
  let boat = createBoat(race.time)
  for (let i = 0; i < d; i++) {
    boat = charge(boat);
  }
  return boat;
}

function findWinningMovesInRace(race) {
  seen = {};
  const moves = [...Array(race.time).keys()]
  const charges = moves.map(m => chargeMove(m, race));
  const myDistances = charges.map(b => coast(b));
  return myDistances.filter(e=> e > race.dist).length
}

const sum = races.reduce((prev, cur) => findWinningMovesInRace(cur) + prev, 0);
console.log(sum)