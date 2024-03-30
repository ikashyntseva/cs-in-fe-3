"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BCD_1 = require("./BCD");
let n = new BCD_1.BCD(65536n);
n = new BCD_1.BCD(-1n);
console.log(n.add(-10));
