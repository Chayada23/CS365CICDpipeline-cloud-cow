#!/bin/bash
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx