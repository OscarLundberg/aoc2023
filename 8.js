import fs from "fs";
const inp = fs.readFileSync("./input.txt", "utf-8");
const [directions, ...rest] = inp.split("\n")
const json = rest.join("\n")
  .replaceAll("=", ":")
  .replaceAll("(", "{")
  .replaceAll(")", "},")
  .replaceAll("/(\w+)/gm", "\"$1\"")
console.log({ json });