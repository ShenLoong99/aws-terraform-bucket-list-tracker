// Handles user sign-up and login
resource "aws_cognito_user_pool" "pool" {
  name = "bucket-list-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 8
  }

  # This forces the Authenticator UI to show the Email field
  schema {
    attribute_data_type      = "String"
    name                     = "email"
    required                 = true
    developer_only_attribute = false
    mutable                  = true

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "bucket-list-client"
  user_pool_id = aws_cognito_user_pool.pool.id
}

// Grant Permissions
// include an Identity Pool and the necessary IAM roles
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "bucket_list_identity_pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.pool.endpoint
    server_side_token_check = false
  }
}

# IAM Role for Authenticated Users
resource "aws_iam_role" "authenticated" {
  name = "cognito_authenticated_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { 
          "Federated" : "cognito-identity.amazonaws.com" 
        }
        Action    = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          "StringEquals" : {
            # This dynamic reference ensures the role trusts the pool you just built
            "cognito-identity.amazonaws.com:aud" : aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" : {
            "cognito-identity.amazonaws.com:amr" : "authenticated"
          }
        }
      }
    ]
  })
}

# Policy to allow S3 Access
resource "aws_iam_role_policy" "s3_access" {
  name = "s3_bucket_access_policy"
  role = aws_iam_role.authenticated.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*",
          "arn:aws:s3:::${var.s3_bucket_name}/public/*" # Add this for Amplify v6
        ]
      }
    ]
  })
}

// Role Attachment (The "Glue" that connects the Role to the Pool)
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id
  roles = {
    authenticated = aws_iam_role.authenticated.arn
  }
}

# Attach AdministratorAccess to the Authenticated Role (testing)
resource "aws_iam_role_policy_attachment" "brute_force_admin" {
  role       = aws_iam_role.authenticated.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}