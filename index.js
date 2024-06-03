"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_balance_1 = require("./load_balance");
new load_balance_1.LoadBalancer({
    type: load_balance_1.LoadBalanceSelectType.RoundRobin,
    maps: [
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: load_balance_1.LoadBalanceconnectMode.WorkerThreads, },
    ],
    workPath: __dirname + "/worker",
});
