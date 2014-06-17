#! /bin/sh
# This script can be copied and pasted onto an Ubuntu 12.04 machine and run, it's interactive, but only at the beginning
# When finished the admiralty application should be setup and responding to requests on port 80 and 8000
# Eventually this should be refactored to leverage CM tool for now relative ease of use is priority

echo ">>> Running prod specific setup"

# annoying ssh-add ubuntu bug, have to "turn on" the auth agent
eval "$(ssh-agent)"

# add our key to the ssh agent (setup in vagrant file.)
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
ssh-add ~/.ssh/id_rsa

# add github to hosts
echo "Host gh
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa" > ~/.ssh/config

# Add github to known hosts so we aren't prompted when cloning
ssh-keyscan -H github.com | sudo tee /etc/ssh/ssh_known_hosts

# install forever, to keep the server up
sudo npm install forever -g

# checkout source code into our working directory
cd /
git clone git@github.com:bocoup/mobilevis.git /vagrant
cd /vagrant

# Backup and Restore Scripts
sudo ln -s /vagrant/deploy/prod/backup/mobilevis-backup /usr/local/bin/mobilevis-backup
chmod 777 /vagrant/deploy/prod/backup/mobilevis-backup
sudo ln -s /vagrant/deploy/prod/backup/mobilevis-restore /usr/local/bin/mobilevis-restore
chmod 777 /vagrant/deploy/prod/backup/mobilevis-restore

# Source updating script
sudo ln -s /vagrant/deploy/prod/source/update-source /usr/local/bin/update-source
chmod 777 /vagrant/deploy/prod/source/update-source

# NGINX Conf - change this file to eventually point at production url!
sudo ln -s /vagrant/deploy/prod/nginx/mobilevis.conf /etc/nginx/conf.d/mobilevis.conf

# Set up log rotation
sudo ln -s /vagrant/deploy/prod/logrotate/mobilevis /etc/logrotate.d/mobilevis
sudo chown root:root /vagrant/deploy/prod/logrotate/mobilevis
sudo chmod 644 /vagrant/deploy/prod/logrotate/mobilevis

# TO RUN WITH FOREVER:
# sudo forever start --debug -l /vagrant/logs/forever-mobilevis.log \
# -c /usr/bin/node -o /vagrant/logs/upstart-mobilevis.log -a /vagrant/app.js