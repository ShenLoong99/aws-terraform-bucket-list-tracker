// Amplify provides the CI/CD pipeline.
resource "aws_amplify_app" "bucket_list" {
  name         = "BucketListTracker"
  repository   = var.github_repo
  # access_token = var.github_token # Personal Access Token

  build_spec = file("amplify.yml")

  # Crucial for Mono-repos (folders within folders)
  # This makes Amplify ignore changes in other folders
  enable_auto_branch_creation = true

  # Environment variables for the frontend to know where the API is
  environment_variables = {
    VITE_GRAPHQL_URL  = var.api_url
    VITE_USER_POOL_ID = var.user_pool_id
    VITE_CLIENT_ID    = var.client_id
    VITE_REGION       = var.region
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.bucket_list.id
  branch_name = "main" # Ensure this matches your GitHub branch name
}