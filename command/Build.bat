echo off
taskkill /f /im node.exe
echo 正在清除node进程，显示“错误”属于正常现象
echo 开始构建
npm run build
echo 构建完毕，正在启动端口为3000
echo 查看：127.0.0.1:3000
node .output/server/index.mjs
