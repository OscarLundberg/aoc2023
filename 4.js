import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const lines = inp.split("\n").filter(e => e);

const pat = /\d+/gm
const sum = lines.reduce((prev, line) => {
  const [name, _winning, _mine] = line.split(/:|\|/gm);
  const wins = _winning.match(pat).map(e => parseInt(e.trim()));
  const mine = _mine.match(pat).map(e => parseInt(e.trim()));

  const score = mine.map((e, i) => wins.includes(e)).filter(e => e)
  let points = 0;
  if(score.length > 0){
    points = 1;
    for(let p = 0; p < score.length - 1; p++){
      points *= 2;
    }
  }
  console.log({ points });

  return prev + (points)
}, 0)



console.log({ sum });