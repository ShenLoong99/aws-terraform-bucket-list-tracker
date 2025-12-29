// Connects the GraphQL API to the DynamoDB table.
resource "aws_appsync_graphql_api" "api" {
  name                = "BucketListAPI"
  schema              = file("schema.graphql")
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  user_pool_config {
    default_action = "ALLOW"
    user_pool_id   = var.user_pool_id
  }
}

resource "aws_appsync_datasource" "ddb_ds" {
  api_id           = aws_appsync_graphql_api.api.id
  name             = "BucketList_DataSource"
  type             = "AMAZON_DYNAMODB"
  service_role_arn = aws_iam_role.appsync_role.arn

  dynamodb_config {
    table_name = var.table_name
  }
}

# (IAM Role for AppSync to access DynamoDB)
resource "aws_iam_role" "appsync_role" {
  name = "appsync_dynamodb_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "appsync.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "appsync_policy" {
  role = aws_iam_role.appsync_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan", "dynamodb:DeleteItem", "dynamodb:UpdateItem"]
      Effect   = "Allow"
      Resource = [var.table_arn]
    }]
  })
}

// Resolver Logic (The "Brain" of the API)
# Resolver for Listing Items
resource "aws_appsync_resolver" "query_list" {
  api_id      = aws_appsync_graphql_api.api.id
  type        = "Query"
  field       = "getBucketList"
  data_source = aws_appsync_datasource.ddb_ds.name

  request_template = <<EOF
{
    "version" : "2017-02-28",
    "operation" : "Scan"
}
EOF

  response_template = "$util.toJson($ctx.result.items)"
}

# Resolver for Adding Items
resource "aws_appsync_resolver" "mutation_add" {
  api_id      = aws_appsync_graphql_api.api.id
  type        = "Mutation"
  field       = "addItem"
  data_source = aws_appsync_datasource.ddb_ds.name

  # This template maps your React arguments (title, imageUrl) to DynamoDB columns
  request_template = <<EOF
{
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
        "id" : $util.dynamodb.toDynamoDBJson($util.autoId())
    },
    "attributeValues" : {
        "title" : $util.dynamodb.toDynamoDBJson($ctx.args.title),
        "imageUrl" : $util.dynamodb.toDynamoDBJson($ctx.args.imageUrl),
        "completed" : $util.dynamodb.toDynamoDBJson(false)
    }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

# Resolver for Deleting Items
resource "aws_appsync_resolver" "delete_item" {
  api_id      = aws_appsync_graphql_api.api.id
  type        = "Mutation"
  field       = "deleteItem"
  data_source = aws_appsync_datasource.ddb_ds.name

  request_template = <<EOF
{
    "version" : "2017-02-28",
    "operation" : "DeleteItem",
    "key" : {
        "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
    }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}