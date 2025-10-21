#!/bin/bash
cd /home/kavia/workspace/code-generation/gym-management-system-21170-21151/gym_frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

