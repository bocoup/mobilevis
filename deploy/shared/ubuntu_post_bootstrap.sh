#! /bin/sh
# This script runs after the shared bootstrapping ran, then the individual
# dev/prod bootstrapping ran. All this has to run once the source is on the
# vm, which means it is either shared, or needs to be checked out of git.

# NGINX Config
mkdir -p /vagrant/logs
touch /vagrant/logs/nginx-mobilevis-access.log
touch /vagrant/logs/nginx-mobilevis-error.log

# Configure Postgres restart postgres
sudo -u postgres createuser -s bocoup
sudo ln -sf /vagrant/deploy/shared/postgres/pg_hba.conf /etc/postgresql/9.3/main/pg_hba.conf
sudo service postgresql restart

# Restore the base level backup which will also create the DB
# will run the deploy/db/schema.sql
# TODO: restore from a snapshot, check for argument. base default.
mobilevis-restore base

cd /vagrant
sudo npm install -g grunt-cli bower
sudo rmdir ~/tmp
npm install
bower --config.interactive=false install

# Daemonize API
# upstart HATES symlinks so we have to manually reload the upstart configuration
# When refactored with a CM tool this file should be COPIED into the directory not symlinked
sudo ln -s /vagrant/deploy/shared/upstart/mobilevis.conf /etc/init/mobilevis.conf
sudo initctl reload-configuration

# restart nginx
sudo service nginx restart

# Start API Daemon
sudo start mobilevis