provider "aws" {
  region = "us-east-1"
}

# -----------------------------
# Variables
# -----------------------------
variable "name" {
  description = "Name for resources"
  default     = "sample-app"
}

variable "vpc_id" {
  description = "VPC ID"
}

variable "subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

# -----------------------------
# Security Group
# -----------------------------
resource "aws_security_group" "sample_app" {
  name        = var.name
  description = "Allow HTTP traffic into ${var.name}"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "allow_http_inbound" {
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  security_group_id = aws_security_group.sample_app.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# -----------------------------
# EC2 Instance
# -----------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_instance" "sample_app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = var.subnet_ids[0]       # ใช้ subnet ที่ส่งผ่าน -var
  vpc_security_group_ids = [aws_security_group.sample_app.id]
  user_data              = file("${path.module}/user-data.sh")
  tags = { Name = var.name }
}

# -----------------------------
# Target Group
# -----------------------------
resource "aws_lb_target_group" "sample_app_tg" {
  name        = "${var.name}-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

# -----------------------------
# Load Balancer
# -----------------------------
resource "aws_lb" "sample_app_alb" {
  name               = "${var.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.sample_app.id]
  subnets            = var.subnet_ids
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.sample_app_alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sample_app_tg.arn
  }
}

resource "aws_lb_target_group_attachment" "sample_app_attachment" {
  target_group_arn = aws_lb_target_group.sample_app_tg.arn
  target_id        = aws_instance.sample_app.id
  port             = 8080
}