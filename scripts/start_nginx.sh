#!/bin/bash
# ไฟล์ใหม่ถูก copy มาแล้ว แค่ start nginx
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx