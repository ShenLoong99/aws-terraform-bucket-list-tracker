output "amplify_app_url" {
  value = module.hosting.app_url
}

output "VITE_GRAPHQL_URL" {
  value = module.api.api_url
}

output "VITE_USER_POOL_ID" {
  value = module.auth.user_pool_id
}

output "VITE_CLIENT_ID" {
  value = module.auth.client_id
}

output "VITE_IDENTITY_POOL_ID" {
  value = module.auth.identity_pool_id
}

output "VITE_S3_BUCKET" {
  value = module.storage.bucket_name
}

output "VITE_REGION" {
  value = var.aws_region
}