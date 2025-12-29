variable "aws_region" {
  type    = string
  default = "ap-southeast-1"
}

variable "github_token" {
  type        = string
  description = "GitHub Personal Access Token for Amplify"
  sensitive   = true
}

variable "github_repo" {
  type        = string
  description = "The URL of your GitHub repository"
  default     = "https://github.com/ShenLoong99/aws-terraform-bucket-list-tracker"
}