import { LoadBalanceconnectMode, LoadBalancer, LoadBalanceSelectType } from "./load_balance";

new LoadBalancer({
    type: LoadBalanceSelectType.RoundRobin,
    maps:[
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 0
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 1
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 2
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 3
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 4
        { mode: LoadBalanceconnectMode.WorkerThreads, },        // 5
    ],
    workPath : __dirname + "/worker",
    ports: [ 1234 ],
});