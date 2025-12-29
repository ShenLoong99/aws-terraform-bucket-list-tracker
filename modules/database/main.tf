// This table stores your bucket list items. We use a simple id as the partition key.
resource "aws_dynamodb_table" "bucket_list" {
  name         = "BucketListItems"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "BucketListTable" }
}