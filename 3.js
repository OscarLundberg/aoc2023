import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const lines = inp.split("\n");
class Entry {
  static entries = {}
  static lookup = {};

  constructor(char) {
    this.char = char;
    this.uuid = `${Math.random()}`;
  }

  static place(entry, pos) {
    Entry.entries[pos.x] = {
      ...(Entry.entries?.[pos.x] ?? {}),
      [pos.y]: entry
    }
    Entry.lookup[entry.uuid] = [
      ...(Entry.lookup?.[entry.uuid] ?? []),
      pos
    ]
  }

  getNeighbors() {
    const positions = Entry.lookup?.[this.uuid] ?? [];
    return positions.flatMap(pos => {
      return [
        Entry.entries?.[pos.x - 1]?.[pos.y] ?? null,
        Entry.entries?.[pos.x + 1]?.[pos.y] ?? null,
        Entry.entries?.[pos.x]?.[pos.y + 1] ?? null,
        Entry.entries?.[pos.x]?.[pos.y - 1] ?? null,
        Entry.entries?.[pos.x - 1]?.[pos.y - 1] ?? null,
        Entry.entries?.[pos.x + 1]?.[pos.y - 1] ?? null,
        Entry.entries?.[pos.x - 1]?.[pos.y + 1] ?? null,
        Entry.entries?.[pos.x + 1]?.[pos.y + 1] ?? null
      ]
    }
    ).filter(e => e && e.uuid != this.uuid);
  }

  isPartNumber() {
    return this.getNeighbors().filter(e => e).some(e => {
      const match = e.char.match(/[A-z]|[0-9]|\./)
      if (match) { return false }
      return true;
    })
  }
}

const sum = lines.flatMap((e, y) => {
  const matches = e.matchAll(/\d+|[^\w\.\s]+/gs)
  let lineEntries = [];
  for (let m of matches) {
    if (!m) {
      continue;
    }
    const e = new Entry(m[0])
    for (let x = 0; x < m[0].length; x++) {
      Entry.place(e, { x: m.index + x, y })
    }
    lineEntries = [...lineEntries, e];
  }
  return lineEntries;
}).reduce((prev, cur) => {
  return prev + (cur.isPartNumber() ? parseInt(cur.char) : 0)
}, 0);

console.log({ e: Entry.entries })
console.log({ sum })
