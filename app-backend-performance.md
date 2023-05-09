# Test machine:

MacBook Pro (Retina, 15-inch, Mid 2014)  
2.5 GHz Quad-Core Intel Core i7

# Test tool [wrk](https://github.com/wg/wrk)

brew install wrk

# Test command

wrk -t8 -c400 -d30s *target-node-url*  

Target nodes all connect to same router via wifi

1. Target [bhttp](https://github.com/novice79/bhttp)(home-made using c++ boost asio, i.e. this app backend) run on:  
iphone6s with ios15.7.3(leave app run on foreground, and plug in charger)

```
wrk -t8 -c400 -d30s http://192.168.0.68:7777/index.html
Running 30s test @ http://192.168.0.68:7777/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   248.11ms  230.49ms   1.98s    92.16%
    Req/Sec   195.67     73.64   434.00     69.29%
  37724 requests in 30.03s, 114.44MB read
  Socket errors: connect 0, read 3998, write 0, timeout 372
Requests/sec:   1256.21
Transfer/sec:      3.81MB
```


2. Target [bhttp](https://github.com/novice79/bhttp)(home-made using c++ boost asio, i.e. this app backend) run on:  
OnePlus 5T(leave app run on foreground, and plug in charger)

```
wrk -t8 -c400 -d30s http://192.168.0.172:7777/index.html
Running 30s test @ http://192.168.0.172:7777/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    80.56ms   18.10ms 217.91ms   86.83%
    Req/Sec   597.38    109.57     1.03k    79.56%
  142785 requests in 30.09s, 433.16MB read
Requests/sec:   4745.83
Transfer/sec:     14.40MB
```

**For comparison**

3. Target [Nginx](http://nginx.org/):v1.18(sudo apt install nginx, default settings; same index.html) os: Ubuntu 22.04 run on:  
Lenovo ideapad y700(Intel® Core™ i7-6700HQ CPU @ 2.60GHz × 8)

```
wrk -t8 -c400 -d30s http://192.168.0.69/index.html
Running 30s test @ http://192.168.0.69/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   108.45ms   26.92ms 730.28ms   81.62%
    Req/Sec   461.65    107.16   747.00     71.94%
  110369 requests in 30.09s, 343.30MB read
Requests/sec:   3668.35
Transfer/sec:     11.41MB
```

3. Target nodejs/lts+express(cluster mode; same index.html) os: Ubuntu 22.04 run on:  
Lenovo ideapad y700(Intel® Core™ i7-6700HQ CPU @ 2.60GHz × 8)

```
wrk -t8 -c400 -d30s http://192.168.0.69:3000/index.html
Running 30s test @ http://192.168.0.69:3000/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   112.33ms   29.35ms 635.95ms   79.86%
    Req/Sec   447.80    112.88   780.00     71.47%
  106983 requests in 30.10s, 339.76MB read
Requests/sec:   3554.39
Transfer/sec:     11.29MB
```
**For another comparison**

4. Target [bhttp](https://github.com/novice79/bhttp) (home-made using c++ boost asio, i.e. this app backend--x86_64 linux version)  
os: Ubuntu 22.04. run on:  
Lenovo ideapad y700(Intel® Core™ i7-6700HQ CPU @ 2.60GHz × 8)

```
wrk -t8 -c400 -d30s http://192.168.0.69:7777/index.html
Running 30s test @ http://192.168.0.69:7777/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   107.36ms   23.73ms 624.19ms   78.97%
    Req/Sec   467.96    104.90   780.00     74.05%
  111897 requests in 30.08s, 339.98MB read
Requests/sec:   3719.46
Transfer/sec:     11.30MB
```

**For fun to compare bhttp vs nginx vs nodejs** on  
raspberry pi 2(A 900MHz quad-core ARM Cortex-A7 CPU
1GB RAM)  
- nodejs_v20.1.0 + express_4.18.2, serve same static index.html file
```js
const express = require("express");
const port = 3000;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
if (cluster.isMaster) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.static('public'))
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

```
Result:  
```
wrk -t8 -c400 -d30s http://192.168.1.202:3000/index.html
Running 30s test @ http://192.168.1.202:3000/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.16s   369.68ms   2.00s    66.02%
    Req/Sec    34.84     20.45   120.00     67.32%
  7739 requests in 30.10s, 24.56MB read
  Socket errors: connect 0, read 0, write 0, timeout 346
Requests/sec:    257.14
Transfer/sec:    835.70KB
```

- bhttp(home-made c++ boost asio http server)--linux_armv7 version  
Result:  
```
wrk -t8 -c400 -d30s http://192.168.1.202:7777/index.html
Running 30s test @ http://192.168.1.202:7777/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   229.26ms  147.25ms   2.00s    87.07%
    Req/Sec   226.71     51.95   415.00     67.74%
  54088 requests in 30.01s, 164.63MB read
  Socket errors: connect 0, read 1, write 0, timeout 55
Requests/sec:   1802.28
Transfer/sec:      5.49MB
```

- nginx/1.18.0 default settings, serve same index.html file  
Result:  
```
wrk -t8 -c400 -d30s http://192.168.1.202/index.html
Running 30s test @ http://192.168.1.202/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   210.39ms  155.45ms   1.98s    75.13%
    Req/Sec   245.89     46.38   424.00     73.53%
  58766 requests in 30.09s, 183.31MB read
  Socket errors: connect 0, read 0, write 0, timeout 8
Requests/sec:   1952.89
Transfer/sec:      6.09MB
```

# Summary

*Serve Static files:*

| Device/HttpServer | bhttp | nginx/1.18.0 | nodejs + express |
| --- | :---: | :---: | :---: |
| Iphone 6s | RPS: 1256.21 | N/A | N/A |
| OnePlus 5T | RPS: 4745.83 | N/A | N/A |
| raspberry pi 2 | RPS: 1802.28 | RPS: 1952.89 | RPS: 257.14 |
| Lenovo ideapad y700 | RPS: 3719.46 |RPS: 3668.35 | 3554.39 |
