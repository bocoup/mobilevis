#!/bin/bash

set -e

npm run build

cd public
rm -rf .git
cp -r ../.git .
echo mobilev.is > CNAME
git add .
git commit -m 'Deploy'
git push --force origin HEAD:gh-pages
