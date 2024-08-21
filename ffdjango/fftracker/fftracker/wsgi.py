"""
WSGI config for fftracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

environment = os.environ.get('APPSETTING_ENVIRONMENT')

if not environment:
    environment = 'development'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fftracker.settings-deploy')

application = get_wsgi_application()
