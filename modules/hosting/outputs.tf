output "app_url" {
  value = "https://main.${aws_amplify_app.bucket_list.default_domain}"
}

output "amplify_app_id" {
  value = aws_amplify_app.bucket_list.id
}