#! /bin/sh
# This script can be copied and pasted onto an Ubuntu 12.04 machine and run, it's interactive, but only at the beginning
# When finished the admiralty application should be setup and responding to requests on port 80 and 8000
# Eventually this should be refactored to leverage CM tool for now relative ease of use is priority

echo ">>> Running dev specific setup"

# Bind /etc/hosts to configured domains
sudo -- sh -c "echo 127.0.0.1 mobilevis.loc>> /etc/hosts"

# Backup and Restore Scripts
sudo ln -s /vagrant/deploy/dev/backup/mobilevis-backup /usr/local/bin/mobilevis-backup
chmod 777 /vagrant/deploy/dev/backup/mobilevis-backup
sudo ln -s /vagrant/deploy/dev/backup/mobilevis-restore /usr/local/bin/mobilevis-restore
chmod 777 /vagrant/deploy/dev/backup/mobilevis-restore

# NGINX Conf
sudo ln -s /vagrant/deploy/dev/nginx/mobilevis.conf /etc/nginx/conf.d/mobilevis.conf