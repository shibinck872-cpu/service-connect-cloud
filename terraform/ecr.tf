# 1. Backend ECR Repository
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true  # Automatically scans your Node.js image for vulnerabilities on push
  }

  tags = {
    Environment = var.environment
  }
}

# 2. Frontend ECR Repository
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
  }
}

# 3. Nginx Gateway ECR Repository
resource "aws_ecr_repository" "gateway" {
  name                 = "${var.project_name}-gateway"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
  }
}

# 4. Define Lifecycle Policy (Cleans out old images to save storage costs)
resource "aws_ecr_lifecycle_policy" "clean_policy" {
  for_each = toset([
    aws_ecr_repository.backend.name,
    aws_ecr_repository.frontend.name,
    aws_ecr_repository.gateway.name
  ])

  repository = each.value

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep only the last 30 compiled images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": 30
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
