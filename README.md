# Advanced DevSecOps CI/CD Serverless Lambda Deployment with PoLP Integration Testing

A professional, production-grade **DevSecOps CI/CD pipeline** built using **GitHub Actions** to deploy a **serverless AWS Lambda (Node.js) API** with **Least Privilege (PoLP) IAM**, automated **integration testing**, secure **credential handling**, and **tag-based promotion** to protected environments.

This project demonstrates real-world DevOps, Security, and Cloud Engineering best practices.

---

## Overview

Modern cloud-native systems require secure, automated, and reliable deployment pipelines.  
This project implements an **end-to-end DevSecOps CI/CD workflow** that ensures:

- Secure deployments without exposing cloud credentials
- Automated testing before production release
- Least Privilege IAM enforcement
- Controlled promotion to protected environments

It is designed to reflect **industry-grade DevSecOps standards** used in enterprise environments.

---

## Key Features

- Multi-stage CI/CD pipeline using GitHub Actions
- Serverless API deployment on AWS Lambda
- Least Privilege (PoLP) IAM policy enforcement
- Secure workflows without long-lived cloud credentials
- Automated integration testing
- Zero-downtime deployments
- Tag-based promotion to protected production environments
- Environment separation (dev / test / prod)

---

## Tech Stack

- **CI/CD:** GitHub Actions
- **Cloud Provider:** AWS
- **Compute:** AWS Lambda (Serverless)
- **Language:** Node.js
- **Security:** IAM Least Privilege (PoLP)
- **Testing:** Automated Integration Tests
- **Infrastructure:** Serverless Framework / AWS CLI
- **Version Control:** Git & GitHub

---

## Repository Structure

Advanced-DevSecOps-CI-CD-Serverless-Lambda/
│
├── .github/workflows/     # CI/CD pipeline definitions
├── api/                   # Lambda API source code
├── test/                  # Integration tests
├── __tests__/             # Additional test cases
├── index.js               # Entry point
├── .eslintrc.json         # Linting configuration
├── .gitignore             # Git ignore rules
├── serverlessrc.bak       # Serverless backup config
└── README.md              # Project documentation

---

## CI/CD Pipeline Flow

1. Code is pushed to the repository
2. GitHub Actions pipeline is triggered
3. Static checks and linting are executed
4. Integration tests are run automatically
5. Secure AWS authentication is performed
6. Lambda function is deployed
7. Tag-based promotion controls production release
8. Deployment completes with zero downtime

---

## Security Practices Implemented

- No hardcoded cloud credentials
- GitHub Secrets used for sensitive values
- Least Privilege IAM roles
- Environment-based access control
- Protected production deployments
- Automated testing before release

---

## How to Run Locally (Optional)

1. Clone the repository  
2. Install dependencies  
3. Configure AWS credentials securely  
4. Deploy using Serverless Framework or AWS CLI  

(Note: Local setup is optional as the project focuses on CI/CD automation.)

---

## Use Cases

- DevSecOps portfolio project
- Cloud & DevOps engineering interviews
- CI/CD pipeline reference implementation
- Serverless deployment learning
- Security-first DevOps demonstrations

---

## Future Enhancements

- Infrastructure as Code (Terraform)
- Security scanning (SAST / DAST)
- Monitoring & alerting integration
- Canary deployments
- Multi-region support

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

## Author

Nhowmitha Suresh  
Artificial Intelligence & Data Science  
Undergraduate | 3rd Year  
Aspiring DevSecOps & Cloud Engineer
