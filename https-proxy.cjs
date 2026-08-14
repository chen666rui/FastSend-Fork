const https = require('https');
const fs = require('fs');
const httpProxy = require('http-proxy');

// 读取证书 (保持你之前能成功启动的路径)
const options = {
    key:  fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};

const proxy = httpProxy.createProxyServer({
    target: 'http://127.0.0.1:3000',
    ws: true,          // 支持 WebSocket (FastSend 信令必需)
    changeOrigin: true, // ⭐ 关键！把 Host 头改成本地地址，骗过 FastSend
    xfwd: true          // 附带真实客户端信息
});

https.createServer(options, (req, res) => {
    proxy.web(req, res);
}).on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head); // WebSocket 转发
}).listen(443, () => {
    console.log('✅ HTTPS 代理已启动，监听 443 端口，转发至本地 3000');
});

// 出错时打印日志，方便排查
proxy.on('error', (err, req, res) => {
    console.error('❌ 代理出错:', err.message);
});