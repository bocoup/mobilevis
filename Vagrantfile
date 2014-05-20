# -*- mode: ruby -*-
# vi: set ft=ruby :
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise64"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.30"

  config.vm.provision :file, :source => 'deploy/keys/aws_config', :destination => '~/.aws/config'

  # Many commands in the bootstrap.sh file are run as sudo, but in general we want to not run every command as a privileged
  # user otherwise when we do things like checkout code or run our awscli commands our config files will be missing
  config.vm.provision :shell, :path => 'deploy/ubuntu_bootstrap.sh', :privileged => false

end