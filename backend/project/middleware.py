# Middleware to allow Private Network Access preflight responses during local development
from django.utils.deprecation import MiddlewareMixin

class AllowPrivateNetworkMiddleware(MiddlewareMixin):
    """Ajoute l'en-tête Access-Control-Allow-Private-Network si la préflight demande l'accès au réseau privé.
    Attention: ceci est utile uniquement pour le développement local. Ne pas activer en production sans comprendre les implications.
    """
    def process_response(self, request, response):
        # Les navigateurs envoient Access-Control-Request-Private-Network dans la requête preflight
        if request.META.get('HTTP_ACCESS_CONTROL_REQUEST_PRIVATE_NETWORK', '').lower() == 'true':
            response['Access-Control-Allow-Private-Network'] = 'true'
        return response

