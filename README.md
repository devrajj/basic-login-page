# basic-login-page

### Genral Information

```
This Repository uses a signup and login journey using ExpressJs and MongoDb
```

### To install packages

```
Before running the project run below command
npm i 
```

### Install MongoDb 
Install mongodb server community edition locally. Do not enable authentication for it.

```
brew install mongodb
sudo mkdir -p /data/db
sudo chown -R "$USER" /data/db
brew services start mongodb
```


### To check the load testing for concurrent request we are using loadtest

```
loadtest -n 10 -c 10 http://localhost:3000/first
loadtest -n 10 -c 10 http://localhost:3000/second
loadtest -n 10 -c 10 http://localhost:3000/third
Run these three after starting node fork-demo.js server to see the time each request 
takes and request per second
```
