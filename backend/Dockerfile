# Dockerfile pour backend Django
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt ./

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source
COPY . .

# Exposer le port 8000 (Django par défaut)
EXPOSE 8000

# Commande de démarrage du serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

