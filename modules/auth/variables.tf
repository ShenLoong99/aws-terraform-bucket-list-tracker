variable "s3_bucket_name" {
  description = "The name of the S3 bucket where assets are stored"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
}