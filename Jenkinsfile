pipeline {
    agent any

    environment {
        DOCKERHUB = "onose/node-k8s-app"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/YOUR_GITHUB_REPO/node-k8s-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB:$IMAGE_TAG .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $DOCKERHUB:$IMAGE_TAG'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'sed -i "s|onose/node-k8s-app:.*|onose/node-k8s-app:$IMAGE_TAG|g" deployment.yml'
                sh 'kubectl apply -f deployment.yml'
            }
        }
    }
}

i
