// This creates the bucket and configures CORS (Cross-Origin Resource Sharing)
// which is required so React app can upload images directly to the bucket from the browser
resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "bucket_list_assets" {
  bucket        = "bucket-list-tracker-${random_id.suffix.hex}" # Ensures a unique name
  force_destroy = true                                          # Allows terraform to delete the bucket even if it has files
}

resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.bucket_list_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = [var.allowed_origin, "http://localhost:5173"] # Dynamically set from the variable
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}