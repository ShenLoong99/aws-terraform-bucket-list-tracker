variable "github_token" {
  type      = string
  sensitive = true
}

variable "github_repo" {
  type = string
}

variable "api_url" {
  type = string
}

variable "user_pool_id" {
  type = string
}

variable "client_id" {
  type = string
}

variable "region" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}

variable "identity_pool_id" {
  type = string
}