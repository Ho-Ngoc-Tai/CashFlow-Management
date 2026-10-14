pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        ansiColor('xterm')
    }

    environment {
        APP_NAME = 'flowsync-treasury-web'
        DOCKER_REGISTRY = 'registry.hub.docker.com'
        DOCKER_REPO = 'organization/flowsync-web'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials-id'
        SSH_CREDENTIALS_ID = 'vps-ssh-deploy-key'
        IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
                script {
                    echo "🚀 Pipeline Triggered for Branch: ${env.BRANCH_NAME}"
                    echo "Commit: ${env.GIT_COMMIT}"
                }
            }
        }

        stage('Quality Gate & Dependencies') {
            steps {
                sh '''
                    corepack enable && corepack prepare pnpm@latest --activate
                    pnpm install --frozen-lockfile || pnpm install
                    pnpm run lint
                    pnpm exec tsc --noEmit
                '''
            }
        }

        stage('Build Standalone App') {
            steps {
                sh '''
                    export NEXT_TELEMETRY_DISABLED=1
                    export NODE_ENV=production
                    pnpm run build
                '''
            }
        }

        stage('Docker Build & Tag') {
            steps {
                script {
                    sh """
                        docker build -f docker/Dockerfile -t ${DOCKER_REPO}:${IMAGE_TAG} -t ${DOCKER_REPO}:${env.BRANCH_NAME}-latest .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                    branch 'develop'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_REPO}:${IMAGE_TAG}
                        docker push ${DOCKER_REPO}:${env.BRANCH_NAME}-latest
                    """
                }
            }
        }

        stage('Zero-Downtime Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                script {
                    def targetEnv = (env.BRANCH_NAME == 'main') ? 'production' : 'staging'
                    def deployHost = (targetEnv == 'production') ? 'prod.flowsync.internal' : 'staging.flowsync.internal'

                    echo "🚀 Deploying ${DOCKER_REPO}:${IMAGE_TAG} to ${targetEnv} on ${deployHost}..."

                    sshagent(["${SSH_CREDENTIALS_ID}"]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no deploy@${deployHost} '
                                cd /opt/flowsync && \
                                export IMAGE_TAG=${IMAGE_TAG} && \
                                docker compose -f docker/docker-compose.${targetEnv}.yml pull web && \
                                docker compose -f docker/docker-compose.${targetEnv}.yml up -d --remove-orphans && \
                                docker system prune -af --filter "until=72h"
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
        success {
            echo "✅ Pipeline completed successfully for ${env.BRANCH_NAME}!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs and notify engineering team."
        }
    }
}
