provider "aws" {
  region = var.aws_region
}

// This orchestrates the modules and passes data between them (e.g., passing the Database Name to the API)
module "auth" {
  source         = "./modules/auth"
  s3_bucket_name = module.storage.bucket_name
}

module "database" {
  source = "./modules/database"
}

module "api" {
  source       = "./modules/api"
  user_pool_id = module.auth.user_pool_id
  table_name   = module.database.table_name
  table_arn    = module.database.table_arn
}

module "storage" {
  source = "./modules/storage"
  # Change from .aws_amplify_app.bucket_list.id to .amplify_app_id
  allowed_origin = "https://main.${module.hosting.amplify_app_id}.amplifyapp.com"
}

module "hosting" {
  source           = "./modules/hosting"
  github_token     = var.github_token
  github_repo      = var.github_repo
  api_url          = module.api.api_url
  user_pool_id     = module.auth.user_pool_id
  client_id        = module.auth.client_id
  region           = var.aws_region
  s3_bucket_name   = module.storage.bucket_name
  identity_pool_id = module.auth.identity_pool_id
}