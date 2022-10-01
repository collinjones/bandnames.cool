#!/bin/bash

echo Please enter a commit message:

read commit_message

git add .
git commit -m commit_message
git push

echo code deployed

