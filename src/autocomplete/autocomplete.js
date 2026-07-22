import fs from "fs";
import path from "path";
import { Trie } from "../utils/trie.js";
import EventEmitter from "events";
import { writeFileAsync } from "../utils/utils.js";

const filePath = path.resolve("src", "autocomplete", "autocomplete.json");

export const autocomplete = new Trie(JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" })));

export const saver = new EventEmitter();

saver.on("save", () => {
    writeFileAsync(filePath, JSON.stringify(autocomplete, null, 2))
        .catch(err => {
            console.log(err);
        });
});