import fs from "fs";
const input = fs.readFileSync("./input.txt", "utf-8")
const lines = input.split("\n");
const cards = lines.map(e => e.match(/([2-9]|[AKQJT])+\s+(\d+)/gm)[0])
const JOKER = 0;

const TYPES = {
  FiveOfAKind: 12,
  FourOfAKind: 10,
  FullHouse: 8,
  ThreeOfAKind: 6,
  TwoPair: 4,
  OnePair: 2,
  HighCard: 0
}

const hands = cards.map((arr) => {
  const [cards, bid] = arr.split(" ");
  return {
    cards: [...cards].map(cardNameToPoints),
    bid: parseInt(bid),
    _cards: cards
  }
})

function cardNameToPoints(name) {
  let p = parseInt(name)
  const map = {
    A: 14,
    K: 13,
    Q: 12,
    T: 10,
    J: JOKER,
  }
  return p || map[name];
}

const sorted = hands.map(groupBy).sort((a, b) => {
  return a._rank == b._rank
    ? compareHighcard(a, b)
    : a._rank - b._rank
})

const winnings = sorted.reduce((prev, hand, idx) => prev + (hand._bid * (idx + 1)), 0);
console.log({ winnings })
function groupBy(hand) {
  let dict = {
    _score: hand.cards,
    _bid: hand.bid,
    _cards: hand._cards,
  };
  for (let card of hand.cards) {
    dict[card] = (dict?.[card] ?? 0) + 1
  }

  dict._rank = getRank(dict);
  dict._key = Object.keys(TYPES).find(e => TYPES[e] == dict._rank)
  dict._rank *= 1000000;
  return dict;
}

function compareHighcard(a, b) {
  function getHighcardScore(score) {
    let handIndices = score.length - 1
    let value = 0;
    for (let i = 0; i <= handIndices; i++) {
      value += score[i] * (16 ** (handIndices - i))
    }
    return value;
  }

  return getHighcardScore(a._score) - getHighcardScore(b._score);
}

function getRank(group) {
  function compareValue(val, n) {
    return val + (group?.[JOKER] ?? 0) >= n;
  }
  function hasNCardsOfAnyTypeExcept(name, n) {
    const search = Object.entries(group).some(([key, val]) => key != JOKER && !key.startsWith("_") && key != name && val >= n)
    return search;
  }

  function hasNCardsOfAnyType(n) {
    const search = Object.entries(group).find(([key, val]) => key != JOKER && !key.startsWith("_") && compareValue(val, n))
    return search?.[0] ?? null;
  }

  if (group[JOKER] == 5) { return TYPES.FiveOfAKind }

  if (hasNCardsOfAnyType(5)) {
    return TYPES.FiveOfAKind
  }

  if (hasNCardsOfAnyType(4)) {
    return TYPES.FourOfAKind
  }

  let threeOfAKind = hasNCardsOfAnyType(3);
  if (threeOfAKind != null) {
    if (hasNCardsOfAnyTypeExcept(threeOfAKind, 2)) {
      return TYPES.FullHouse
    }
    return TYPES.ThreeOfAKind
  }


  let first2p = hasNCardsOfAnyType(2);
  if (first2p != null) {
    if (hasNCardsOfAnyTypeExcept(first2p, 2)) {
      return TYPES.TwoPair
    }
    return TYPES.OnePair
  }

  return TYPES.HighCard
}