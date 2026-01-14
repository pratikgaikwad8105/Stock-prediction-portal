"""
WSGI config for stock_prediction_main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
# Ensure TF legacy Keras flag is not set before importing TensorFlow in WSGI
os.environ.pop('TF_USE_LEGACY_KERAS', None)

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')

application = get_wsgi_application()
