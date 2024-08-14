#!/bin/bash
echo "Starting server..."

cd fftracker

gunicorn fftracker.wsgi:application --bind 0.0.0.0:8000 --timeout 300

exec "$@"