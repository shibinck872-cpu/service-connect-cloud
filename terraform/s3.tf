# Secure S3 Bucket for Application Media Assets (aligns with Resume specification)
resource "aws_s3_bucket" "app_assets" {
  bucket_prefix = "${var.project_name}-assets-"
  force_destroy = true # Allows clean tear-down during terraform destroy

  tags = {
    Name        = "${var.project_name}-media-assets"
    Environment = var.environment
  }
}

# Block all public access to the S3 bucket to maintain secure boundaries
resource "aws_s3_bucket_public_access_block" "app_assets" {
  bucket = aws_s3_bucket.app_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
