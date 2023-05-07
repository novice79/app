# Test machine:

MacBook Pro (Retina, 15-inch, Mid 2014)  
2.5 GHz Quad-Core Intel Core i7

# Test tool [wrk](https://github.com/wg/wrk)

brew install wrk

# Test command

wrk -t8 -c400 -d30s *target-node-url*  

Target nodes all connect to same router via wifi

1. Target http server(home-made using c++ asio, i.e. this app backend) run on:  
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


2. Target http server(home-made using c++ asio, i.e. this app backend) run on:  
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

3. Target http server  
Nginx:v1.18(sudo apt install nginx, default settings) os: Ubuntu 22.04 run on:  
Lenovo ideapad y700(Intel® Core™ i7-6700HQ CPU @ 2.60GHz × 8)

```
wrk -t8 -c400 -d30s http://192.168.0.69/index.html
Running 30s test @ http://192.168.0.69/index.html
  8 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    95.23ms   51.39ms   1.74s    79.56%
    Req/Sec   174.05     71.63   747.00     70.82%
  38613 requests in 30.09s, 402.88MB read
  Socket errors: connect 0, read 0, write 0, timeout 452
Requests/sec:   1283.29
Transfer/sec:     13.39MB
```

**For another comparison**

4. Target http server (home-made using c++ asio, i.e. this app backend--x86_64 linux version)  
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

# Summary

Kind of surprise, OnePlus 5T(with android 10) is the winner.  
Another note: android, ios app are all debug version, not publish yet