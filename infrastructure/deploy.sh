#!/usr/bin/env bash
set -euo pipefail

# Script pour builder les images frontend/backend, les pousser dans ACR, et appliquer le déploiement Kubernetes.
# Usage: ./deploy.sh
# Pré-requis:
# - docker installé et connecté (docker login) ou az acr login --name <acr_name>
# - kubectl configuré pour le cluster cible
# - (optionnel) az CLI si vous voulez utiliser az acr login

# Lire la version actuelle ou initialiser à 2
VERSION_FILE="deploy_version.txt"
if [ -f "$VERSION_FILE" ]; then
  VERSION=$(cat "$VERSION_FILE")
else
  VERSION=0
fi

# Incrémenter
VERSION=$((VERSION + 1))
echo "$VERSION" > "$VERSION_FILE"
TAG="v${VERSION}"

ACR_HOST=gigaxregistrytest.azurecr.io
BACKEND_IMAGE=${ACR_HOST}/plateformeiot-backend:${TAG}
FRONTEND_IMAGE=${ACR_HOST}/plateformeiot-frontend:${TAG}
FRONTEND_BUILD_ARG_REACT_APP_API_URL="https://4.178.187.0.nip.io/api/"

echo "Build backend image: ${BACKEND_IMAGE}"
docker build -t "${BACKEND_IMAGE}" ./backend

echo "Build frontend image with REACT_APP_API_URL=${FRONTEND_BUILD_ARG_REACT_APP_API_URL}"
docker build --build-arg REACT_APP_API_URL="${FRONTEND_BUILD_ARG_REACT_APP_API_URL}" -t "${FRONTEND_IMAGE}" ./frontend

# Login to ACR (uncomment and edit if using Azure CLI)
#az acr login --name <acr_name_without_domain>

echo "Pushing backend image"
docker push "${BACKEND_IMAGE}"

echo "Pushing frontend image"
docker push "${FRONTEND_IMAGE}"

# Apply k8s manifests
K8S_MANIFEST="infrastructure/deploy.yaml"
if [ -f "${K8S_MANIFEST}" ]; then
  echo "Applying Kubernetes manifest ${K8S_MANIFEST}"
  kubectl apply -f "${K8S_MANIFEST}"
  echo "Forcer un rollout des déploiements pour utiliser les nouvelles images"
  kubectl set image deployment/backend backend="${BACKEND_IMAGE}" --record || true
  kubectl set image deployment/frontend frontend="${FRONTEND_IMAGE}" --record || true
  kubectl rollout status deployment/backend --timeout=120s || true
  kubectl rollout status deployment/frontend --timeout=120s || true
else
  echo "Manifest ${K8S_MANIFEST} non trouvé. Abandon."
  exit 1
fi

echo "Déploiement terminé. Vérifiez les pods et services:"
kubectl get pods -o wide
kubectl get svc

