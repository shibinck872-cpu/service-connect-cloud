# 1. ALB Security Group (Public Gateway)
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Controls public inbound traffic to the ALB"
  vpc_id      = aws_vpc.main.id

  # Inbound rule: allow HTTP from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound rule: allow HTTPS from anywhere
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rule: allow all egress traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# 2. ECS Task Security Group (Private Containers)
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-ecs-tasks-sg"
  description = "Allows inbound traffic only from the ALB security group"
  vpc_id      = aws_vpc.main.id

  # Inbound rule: allow traffic on container ports ONLY from the ALB's security group
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id]  # <-- Reference isolation
  }

  # Outbound rule: allow all egress traffic to connect to database and APIs
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-tasks-sg"
  }
}
