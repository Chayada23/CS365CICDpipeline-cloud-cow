terraform {
  backend "s3" {
    bucket         = "my-aws-bucket-two-tier-app"
    region         = "us-east-1"
    key            = "Non-Modularized/Two-Tier-Architecture/terraform.tfstate"
    use_lockfile = true
    encrypt        = true
  }
  required_version = ">=0.13.0"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}