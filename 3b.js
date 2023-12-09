import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const lines = inp.split("\n");
class Entry {
  static entries = {}
  static lookup = {};
  static getById(uuid) {
    const pos = Entry.lookup[uuid][0]
    return this.entries[pos.x][pos.y]
  }
  constructor(char) {
    this.char = char;
    this.uuid = `${Math.random()}`;
    this.gearRatio = null;
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

  getNeighborUuid() {
    const positions = Entry.lookup?.[this.uuid] ?? [];
    const ids = positions.flatMap(pos => {
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
    ).filter(e => e && e.uuid != this.uuid).map(e=>e.uuid);
    return [...new Set(ids)];
  }

  isPartNumber() {
    return this.getNeighborUuid().map((id) => Entry.getById(id)).filter(e => e).some(e => {
      const match = e.char.match(/[A-z]|[0-9]|\./)
      if (match) { return false }
      return true;
    })
  }

  getPartNumber() {
    return parseInt(this.char);
  }

  isGear() {
    if (this.char != "*") return false;

    const nb = this.getNeighborUuid().map((id) => Entry.getById(id));
    const hasGearRatio = nb.map(e => e.isPartNumber()).length == 2
    if (hasGearRatio) {
      this.gearRatio = nb[0].getPartNumber() * nb[1].getPartNumber()
    }
    return hasGearRatio;
  }
}

const gears = lines.flatMap((e, y) => {
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
})
  .filter(e => e.isGear());

const sum = gears.reduce((prev, e) => prev + e.gearRatio, 0)

console.log({ sum })