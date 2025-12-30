// Amplify provides the CI/CD pipeline.
resource "aws_amplify_app" "bucket_list" {
  name         = "BucketListTracker"
  repository   = var.github_repo
  access_token = var.github_token # Personal Access Token

  build_spec = file("amplify.yml")

  # Crucial for Mono-repos (folders within folders)
  # This makes Amplify ignore changes in other folders
  enable_auto_branch_creation = true

  # Environment variables for the frontend to know where the API is
  environment_variables = {
    VITE_GRAPHQL_URL      = var.api_url
    VITE_USER_POOL_ID     = var.user_pool_id
    VITE_CLIENT_ID        = var.client_id
    VITE_REGION           = var.region
    VITE_S3_BUCKET        = var.s3_bucket_name
    VITE_IDENTITY_POOL_ID = var.identity_pool_id
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.bucket_list.id
  branch_name = "main" # Ensure this matches your GitHub branch name

  # Enables the "Continuous Deployment" feature
  enable_auto_build = false

  # Optional: framework for better optimization
  framework = "React"
}

resource "aws_amplify_webhook" "trigger" {
  app_id      = aws_amplify_app.bucket_list.id
  branch_name = aws_amplify_branch.main.branch_name
  description = "Triggered by Terraform Cloud"
}

resource "null_resource" "trigger_amplify_build" {
  # This ensures it only runs AFTER the app and variables are updated
  triggers = {
    always_run = timestamp()                                                   # This changes every single time you run terraform apply
    env_vars   = jsonencode(aws_amplify_app.bucket_list.environment_variables) # Keep this so you can track if vars changed in the logs
  }

  provisioner "local-exec" {
    # Note: We use -k if your runner has SSL cert issues, 
    # but for Terraform Cloud, standard curl is fine.
    command = "curl -X POST -d {} '${aws_amplify_webhook.trigger.url}&operation=startbuild' -H 'Content-Type: application/json'"
  }
}