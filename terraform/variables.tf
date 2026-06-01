variable "aws_region" {
  type        = string
  description = "The AWS region to deploy all resources"
  default     = "ap-south-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "production"
}

variable "project_name" {
  type        = string
  description = "Name of the project"
  default     = "service-connect"
}
