@echo off
cd /d C:\laragon\www\steamanalyzer
start cmd /k "node backend/server.js"
start cmd /k "cd frontend && npm run dev"
