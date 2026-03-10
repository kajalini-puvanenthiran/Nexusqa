pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND  = "nexusqa-backend"
        DOCKER_IMAGE_FRONTEND = "nexusqa-frontend"
        GITHUB_REPO           = "kajalini-puvanenthiran/Nexusqa"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "https://github.com/${GITHUB_REPO}.git"
            }
        }

        stage('Backend Build & Test') {
            steps {
                script {
                    echo "Building Backend Container..."
                    sh "docker build -t ${DOCKER_IMAGE_BACKEND} -f docker/backend.Dockerfile ."
                    echo "Running Backend Unit Tests..."
                    sh "docker run --rm ${DOCKER_IMAGE_BACKEND} pytest api/tests"
                }
            }
        }

        stage('Frontend Build & Test') {
            steps {
                script {
                    echo "Building Frontend..."
                    sh "docker build -t ${DOCKER_IMAGE_FRONTEND} -f docker/frontend.Dockerfile ."
                    echo "Running Frontend Tests..."
                    sh "docker run --rm ${DOCKER_IMAGE_FRONTEND} npm run test"
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    echo "Running Security Scans with ZAP..."
                    // Integrating NEXUS QA security agent into CI
                    sh "docker run --rm ${DOCKER_IMAGE_BACKEND} python -m nexusqa.agents.security_agent --target http://app-staging:8000"
                }
            }
        }

        stage('Deploy (Staging)') {
            steps {
                script {
                    echo "Deploying to Staging..."
                    sh "docker-compose up -d"
                }
            }
        }

        stage('Git Automation - Auto Push') {
            steps {
                script {
                    echo "Pushing Updates to GitHub..."
                    sh "git add ."
                    sh "git commit -m 'chore: CI/CD auto-update from Jenkins'"
                    sh "git push origin main"
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports_output/*.pdf, reports_output/*.csv', fingerprint: true
            echo "NEXUS QA CI/CD Run Complete."
        }
        success {
            echo "Deployment SUCCESSFUL."
        }
        failure {
            echo "Pipeline FAILED. Check logs."
        }
    }
}
