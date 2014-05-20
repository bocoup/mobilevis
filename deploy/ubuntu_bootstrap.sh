#! /bin/sh
# This script can be copied and pasted onto an Ubuntu 12.04 machine and run, it's interactive, but only at the beginning
# When finished the admiralty application should be setup and responding to requests on port 80 and 8000
# Eventually this should be refactored to leverage CM tool for now relative ease of use is priority

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

sudo pip install awscli
sudo chmod 644 /home/vagrant/.aws/config

# Configure Postgres restart postgres and php5-fpm so php knows it can talk with postgres
sudo -u postgres createuser -s bocoup
sudo ln -sf /vagrant/deploy/postgres/pg_hba.conf /etc/postgresql/9.1/main/pg_hba.conf
sudo service postgresql restart

cd /vagrant
sudo npm install -g grunt-cli bower
npm install
bower install

# Create API Daemon Log File
sudo touch /var/log/mobilevis.log
sudo chmod 666 /var/log/mobilevis.log

# Daemonize API
# upstart HATES symlinks so we have to manually reload the upstart configuration
# When refactored with a CM tool this file should be COPIED into the directory not symlinked
sudo ln -s /vagrant/deploy/upstart/mobilevis.conf /etc/init/mobilevis.conf
sudo initctl reload-configuration

# Backup and Restore Scripts
sudo ln -s /vagrant/deploy/backup/mobilevis-backup /usr/local/bin/mobilevis-backup
sudo ln -s /vagrant/deploy/backup/mobilevis-restore /usr/local/bin/mobilevis-restore
chmod 777 /vagrant/deploy/backup/mobilevis-backup
chmod 777 /vagrant/deploy/backup/mobilevis-restore

# NGINX Config
mkdir -p /vagrant/logs
touch /vagrant/logs/nginx-mobilevis-access.log
touch /vagrant/logs/nginx-mobilevis-error.log
sudo ln -s /vagrant/deploy/nginx/mobilevis.conf /etc/nginx/conf.d/mobilevis.conf
sudo service nginx restart

# Bind /etc/hosts to configured domains
sudo -- sh -c "echo 127.0.0.1 mobilevis.loc>> /etc/hosts"

# Restore the base level backup which will also create the DB
# will run the deploy/db/schema.sql
/vagrant/deploy/backup/mobilevis-restore base

# Start API Daemon
sudo start mobilevis
