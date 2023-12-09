import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8").split("\n");
const sequences = inp.map(e => [e.split(" ").map(e => parseInt(e))]);

function resolveSequenceToZero(sequence) {
  let level = 0;
  const recalculateDiffs = () => {
    let _diff = [];
    const activeSequence = sequence[level];
    for (let i = 0; i < activeSequence.length - 1; i += 1) {
      _diff = [..._diff, activeSequence[i + 1] - activeSequence[i]]
    }
    return _diff;
  }

  let diff = recalculateDiffs();
  while (true) {
    level += 1;
    sequence[level] = diff;
    if (diff.every(e => e == 0)) {
      break;
    }
    diff = recalculateDiffs();
  }
  return sequence;
}

function extrapolateSequence(_sequence, n = 1) {
  let sequence = resolveSequenceToZero(_sequence)
  const appendAndPropagate = (l, n = 0) => {
    sequence[l] = [...sequence[l], n]
    if (!sequence?.[l - 1]) { return; }
    const next = sequence[l - 1].at(-1) + sequence[l].at(-1)
    return appendAndPropagate(l - 1, next);
  }
  for (let i = 0; i < n; i++) {
    appendAndPropagate(sequence.length - 1);
  }
  return sequence[0].at(-1);
}

const sum = sequences.reduce((prev, cur) => prev + extrapolateSequence(cur), 0);
console.log(sum);