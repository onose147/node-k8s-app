pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        GITHUB_CREDENTIALS = credentials('github-token')
        K8S_TOKEN = credentials('k8s-token')
        K8S_SERVER = "https://192.168.49.2:8443"
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/onose147/node-k8s-app.git',
                        credentialsId: 'github-token'
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t onose147/node-k8s-app:latest .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh """
                        echo \$PASS | docker login -u \$USER --password-stdin
                        docker push onose147/node-k8s-app:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([string(credentialsId: 'k8s-token', variable: 'K8S_TOKEN')]) {
                    sh """
                        kubectl --token=\$K8S_TOKEN \
                            --server=$K8S_SERVER \
                            --insecure-skip-tls-verify=true \
                            --validate=false \
                            -n dev apply -f deployment.yml
                    """
                }
            }
        }
    }
}

