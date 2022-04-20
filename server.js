const app = require("./app");

// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

// Certificate 인증서 경로
const privateKey = fs.readFileSync('/etc/letsencrypt/live/hyeonjun.shop/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/hyeonjun.shop/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/hyeonjun.shop/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(80, () => {
//	console.log('HTTP Server running on port 80');
//});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message }); //multer 에러 핸들링
});

//app.listen(3000, () => {
//  console.log(3000, "http://localhost:3000");
//});
