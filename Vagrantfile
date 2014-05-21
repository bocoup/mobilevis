# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"
NETWORK_IP = "192.168.33.30"
AWS_KEY_SOURCE = 'deploy/shared/keys/aws_config'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.provision "shell", inline: "echo Hello!"

  # dev box
  config.vm.define "dev", primary: true do |dev|

    dev.vm.box = "hashicorp/precise64"
    # Create a private network, which allows host-only access to the machine
    # using a specific IP.
    dev.vm.network "private_network", ip: NETWORK_IP

    dev.vm.provision :file, :source => AWS_KEY_SOURCE, :destination => '~/.aws/config'

    # Many commands in the bootstrap.sh file are run as sudo, but in general we want to not run every command as a privileged
    # user otherwise when we do things like checkout code or run our awscli commands our config files will be missing
    dev.vm.provision :shell, :path => 'deploy/shared/ubuntu_bootstrap.sh', :privileged => false

    # Development specific setup
    dev.vm.provision :shell, :path => 'deploy/dev/ubuntu_bootstrap.sh', :privileged => false

    # shared post bootstrap wrapup
    dev.vm.provision :shell, :path => 'deploy/shared/ubuntu_post_bootstrap.sh', :privileged => false

  end

  # Prod box - to be aws.
  config.vm.define "prod", primary: true do |prod|

    prod.vm.box = "hashicorp/precise64"
    # Create a private network, which allows host-only access to the machine
    # using a specific IP.
    prod.vm.network "private_network", ip: NETWORK_IP

    # disable rsyncing. we will be checking stuff out with github.
    prod.vm.synced_folder ".", "/vagrant", disabled: true

    prod.vm.provision :file, :source => AWS_KEY_SOURCE, :destination => '~/.aws/config'

    # add github friendly keys.
    prod.vm.provision :file, :source => 'deploy/shared/keys/id_rsa', :destination => '~/.ssh/id_rsa'
    prod.vm.provision :file, :source => 'deploy/shared/keys/id_rsa.pub', :destination => '~/.ssh/id_rsa.pub'

    # setup working directory
    prod.vm.provision :shell, :inline => "mkdir -p /vagrant && chown vagrant:vagrant /vagrant", :privileged => true

    # Many commands in the bootstrap.sh file are run as sudo, but in general we want to not run every command as a privileged
    # user otherwise when we do things like checkout code or run our awscli commands our config files will be missing
    prod.vm.provision :shell, :path => 'deploy/shared/ubuntu_bootstrap.sh', :privileged => false

    # Production specific setup
    prod.vm.provision :shell, :path => 'deploy/prod/ubuntu_bootstrap.sh', :privileged => false

    # shared post bootstrap wrapup
    prod.vm.provision :shell, :path => 'deploy/shared/ubuntu_post_bootstrap.sh', :privileged => false

  end

end