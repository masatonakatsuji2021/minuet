"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
process.title = "minuet-server-workprocess";
new _1.LoadBalanceThread(false);
