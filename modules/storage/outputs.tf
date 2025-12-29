output "bucket_name" {
  value = aws_s3_bucket.bucket_list_assets.id
}

output "bucket_arn" {
  value = aws_s3_bucket.bucket_list_assets.arn
}