#!/usr/bin/env bash
# Render custom build script to ensure devDependencies are installed
npm install --include=dev
npm run build
