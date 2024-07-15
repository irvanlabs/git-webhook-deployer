#!/bin/bash
# Pastikan berada di directory project 
echo "Starting deploy process..."
git pull origin main
npm install
pm2 restart all
echo "Deploy process completed."
