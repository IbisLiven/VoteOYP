#!/bin/bash
cd "${0%/*}"
npm install 2>&1
if [ ! -d "node_modules" ]; then
	tar -zxvf node_modules.tar.gz
fi
npm start
