#!/bin/bash
# หยุด nginx และลบไฟล์เก่า
systemctl stop nginx || true
rm -rf /var/www/html/*