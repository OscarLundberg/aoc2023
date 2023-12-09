const fs = require("fs");
const input = fs.readFileSync("./input.txt", "utf-8")
const lines = input.split("\n");
const cards = lines.map(e => e.match(/([2-9]|[AKQJT])+\s+(\d+)/gm)[0])
const hands = cards.map((arr) => {
  const [cards, bid] = arr.split(" ");
  return {
    cards: [...cards].map(cardNameToPoints),
    bid: parseInt(bid)
  }

})

function cardNameToPoints(name) {
  let p = parseInt(name)
  const map = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10
  }
  return p || map[name];
}

const winnings = hands.map(groupBy).sort(compareCards).reduce((prev, hand, idx) => prev + (hand._bid * (idx + 1)), 0);
console.log({ winnings })
function groupBy(hand) {
  let dict = {
    _score: hand.cards,
    _bid: hand.bid,
  };
  for (let card of hand.cards) {
    dict[card] = (dict?.[card] ?? 0) + 1
  }
  dict._rank = getRank(dict);
  return dict;
}

function compareCards(A, B) {
  if(B._rank != A._rank) {
    return A._rank - B._rank;
  }

  for (let i = 0; i < A._score.length; i++) {
    const a = A._score[i];
    const b = B._score[i];
    if (a > b) { return 1 }
    if (b > a) { return -1 }
  }
  return 0
}

function getRank(group) {
  function hasNCardsOfAnyTypeExcept(name, n) {
    const search = Object.entries(group).some(([key, val]) => !key.startsWith("_") && val >= n)
    return search?.[0] ?? null;
  }

  function hasNCardsOfAnyType(n) {
    const search = Object.entries(group).find(([key, val]) => !key.startsWith("_") && val >= n)
    return search?.[0] ?? null;
  }



  if (hasNCardsOfAnyType(5)) {
    return 7;
  }

  if (hasNCardsOfAnyType(4)) {
    return 6
  }

  let first = hasNCardsOfAnyType(3);
  let second = hasNCardsOfAnyTypeExcept(first);
  if (first && second) {
    return 5
  }

  if (hasNCardsOfAnyType(3)) {
    return 4;
  }

  let first2p = hasNCardsOfAnyType(2);
  let second2p = hasNCardsOfAnyTypeExcept(first);

  if (first2p && second2p) {
    return 3;
  }

  if (hasNCardsOfAnyType(2)) {
    return 2;
  }

  return 1;
}