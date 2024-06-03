import { LoadBalanceconnectMode, LoadBalancer, LoadBalanceSelectType } from "./load_balance";

new LoadBalancer({
    type: LoadBalanceSelectType.RoundRobin,
    maps:[
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
        { connectMode: LoadBalanceconnectMode.WorkerThreads, },
    ],
    workPath : __dirname + "/worker",
});