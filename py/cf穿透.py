import subprocess
import re
import requests
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# ================= 🛠️ 配置区域 =================
LOCAL_PORT = 3443                            # FastSend 运行端口
CLOUDFLARED_CMD = r"C:\cf\cloudflared-windows-amd64.exe" # cloudflared 路径

# 👇 填入你的邮箱配置 (以QQ邮箱为例，163邮箱只需改服务器地址)
EMAIL_SENDER = "chen666rui@126.com"          # 发件人邮箱
EMAIL_PASSWORD = "BGZd39mHuDfr9BE8"         # ⚠️ 注意：是授权码，不是邮箱登录密码！
EMAIL_SMTP_SERVER = "smtp.126.com"             # QQ邮箱填 smtp.qq.com，163邮箱填 smtp.163.com
EMAIL_RECEIVER = "chen666rui@126.com"       # 接收链接的邮箱（可以和发件人一样）
# ================================================

def send_email(url):
    if "你的16位SMTP授权码" in EMAIL_PASSWORD:
        print("⚠️ 未配置 SMTP 授权码，跳过邮件发送。")
        return
        
    print("📧 正在将新链接发送到你的邮箱...")
    
    # 构建邮件内容
    subject = f"🚀 FastSend 已就绪 ({datetime.now().strftime('%H:%M')})"
    html_content = f"""
    <html>
      <body>
        <h2>今天的高速传输地址：</h2>
        <p>请点击下方链接直接打开（建议用手机流量测试）：</p>
        <p style="font-size: 18px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
          <a href="{url}" style="color: #0066cc; text-decoration: none;">{url}</a>
        </p>
        <hr>
        <p style="color: gray; font-size: 12px;">此邮件由自动化脚本发送，请勿回复。</p>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = EMAIL_RECEIVER
    msg['Subject'] = subject
    msg.attach(MIMEText(html_content, 'html'))

    try:
        # 使用 SSL 连接 SMTP 服务器 (端口 465)
        server = smtplib.SMTP_SSL(EMAIL_SMTP_SERVER, 465)
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("✅ 邮件发送成功！请查收邮箱。")
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        print("💡 提示：请检查授权码是否正确，或是否开启了设备的网络拦截。")

def main():
    print("🚀 自动化隧道与邮件推送脚本已启动...")
    print(f"🚀 正在启动 Cloudflare 隧道，映射本地 {LOCAL_PORT} 端口...")
    
    process = subprocess.Popen(
                [CLOUDFLARED_CMD, "tunnel", "--url", f"https://localhost:{LOCAL_PORT}", "--no-tlsverify"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding='utf-8',
        errors='ignore'
    )

    try:
        current_url = None
        for line in process.stdout:
            print(f"[CF LOG] {line.strip()}")
            
            match = re.search(r'https://([a-zA-Z0-9-]+\.trycloudflare\.com)', line)
            if match:
                new_url = f"https://{match.group(1)}"
                if new_url != current_url:
                    current_url = new_url
                    print(f"\n🎉 捕获到新链接: {new_url}")
                    send_email(new_url)
                    print("✅ 隧道已建立，网站可正常访问！保持窗口开启...\n")
                    
        process.wait()
    except KeyboardInterrupt:
        print("\n🛑 脚本被手动停止。")
        process.terminate()
    except Exception as e:
        print(f"❌ 发生异常: {e}")
        process.terminate()

if __name__ == "__main__":
    main()