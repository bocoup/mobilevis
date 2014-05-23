#! /bin/sh
# This script can be copied and pasted onto an Ubuntu 12.04 machine and run, it's interactive, but only at the beginning
# When finished the admiralty application should be setup and responding to requests on port 80 and 8000
# Eventually this should be refactored to leverage CM tool for now relative ease of use is priority

echo ">>> Running shared setup"

# nodejs PPA
sudo apt-get update
sudo apt-get -y install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update

# Install Deps
sudo apt-get -y install build-essential
sudo apt-get -y install curl
sudo apt-get -y install git
sudo apt-get -y install python-software-properties
sudo apt-get -y install python
sudo apt-get -y install python-pip
sudo apt-get -y install nginx
sudo apt-get -y install postgresql
sudo apt-get -y install libpq-dev
sudo apt-get -y install nodejs
sudo apt-get -y install curl
sudo apt-get -y install g++
sudo apt-get -y install make
sudo apt-get -y install imagemagick

sudo pip install awscli
sudo chmod 644 /home/vagrant/.aws/config

# Create API Daemon Log File
sudo touch /var/log/mobilevis.log
sudo chmod 666 /var/log/mobilevis.log
