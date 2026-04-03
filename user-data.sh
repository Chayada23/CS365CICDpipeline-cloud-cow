#!/bin/bash

# อัปเดตระบบ
sudo yum update -y                # สำหรับ Amazon Linux
# sudo apt-get update -y          # สำหรับ Ubuntu

# ติดตั้ง nginx และ git
sudo yum install -y nginx git
# สำหรับ Ubuntu: sudo apt-get install -y nginx git

# เปิด nginx ให้รันตอน boot
sudo systemctl enable nginx
sudo systemctl start nginx

# ไปที่ /usr/share/nginx/html
cd /usr/share/nginx/html

# ลบไฟล์ default ของ nginx
sudo rm -f index.html

# Clone repo ที่จะโคลน
sudo git clone https://github.com/Chayada23/MovieDBProject.git

# เปลี่ยนสิทธิ์ไฟล์ให้ nginx อ่านได้
sudo chown -R nginx:nginx /usr/share/nginx/html
sudo chmod -R 755 /usr/share/nginx/html

# รีสตาร์ท nginx
sudo systemctl restart nginx