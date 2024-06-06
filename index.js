"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_balance_1 = require("./load_balance");
new load_balance_1.LoadBalancer({
    type: load_balance_1.LoadBalanceSelectType.RoundRobin,
    maps: [
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 0
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 1
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 2
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 3
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 4
        { mode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, }, // 5
    ],
    workPath: __dirname + "/worker",
    ports: [1234],
});
