#!/bin/bash

PYTHON_VERSION=$(python -c 'import sys; print(sys.version_info[0])')

if [ -z $PYTHON_VERSION ]; then
    PYTHON_VERSION="-1"
else
    cd public/
fi

if [ $PYTHON_VERSION == 2 ]; then
    python -m SimpleHTTPServer
elif [ $PYTHON_VERSION == 3 ]; then
    python -m http.server
else
    echo "I require python but it's not installed. Aborting."; 
    exit 1;
fi
