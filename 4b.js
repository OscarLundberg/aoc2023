import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const lines = inp.split("\n").filter(e => e);

const pat = /\d+/gm
const allCards = lines.reduce((prev, line, idx) => {
  const [name, _winning, _mine] = line.split(/:|\|/gm);
  const wins = _winning.match(pat).map(e => parseInt(e.trim()));
  const mine = _mine.match(pat).map(e => parseInt(e.trim()));
  const score = mine.map((e, i) => wins.includes(e)).filter(e => e)
  let winnings = [];
  let prize = idx + 2;
  for (let win of score) {
    winnings = [...winnings, prize];
    prize += 1;
  }

  return {
    ...prev,
    [idx + 1]: {
      name: idx + 1,
      winnings
    }
  }
}, {});

function countCards(cardIdx) {
  let cardCount = 1;
  const { winnings } = allCards[cardIdx];
  for(let win of winnings){
    cardCount += countCards(win);
  }
  return cardCount;
}
let totalCards = 0;
for (let key of Object.keys(allCards)) {
  totalCards += countCards(key)
}
console.log({totalCards});
