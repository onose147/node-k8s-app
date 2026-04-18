pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'
        GITHUB_CREDENTIALS    = 'github-token'
        K8S_TOKEN_CREDENTIALS = 'k8s-token'
        IMAGE_NAME            = 'onose147/node-k8s-app'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/onose147/node-k8s-app.git',
                        credentialsId: env.GITHUB_CREDENTIALS
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKERHUB_CREDENTIALS,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo \$PASS | docker login -u \$USER --password-stdin
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([string(
                    credentialsId: env.K8S_TOKEN_CREDENTIALS,
                    variable: 'K8S_TOKEN'
                )]) {
                    sh """
                        kubectl --token=\$K8S_TOKEN \
                            --server=https://$(minikube ip):8443 \
                            --insecure-skip-tls-verify=true \
                            -n dev apply -f deployment.yml

                        kubectl --token=\$K8S_TOKEN \
                            --server=https://$(minikube ip):8443 \
                            --insecure-skip-tls-verify=true \
                            -n dev apply -f service.yml
                    """
                }
            }
        }
    }
}

