Vagrant.configure("2") do |config|
  
  config.vm.box = "generic/ubuntu2204"

  config.vm.synced_folder ".", "/vagrant", disabled: true

  # set up custom ssh key pair
  config.ssh.insert_key = false
  config.ssh.private_key_path = ["~/.ssh/vagrant_rsa", "~/.vagrant.d/insecure_private_key"]
  config.vm.provision :shell do |shell|

    ssh_pub_key = File.readlines("#{Dir.home}/.ssh/vagrant_rsa.pub").first.strip

    shell.inline = <<-SCRIPT
    echo #{ssh_pub_key} > /home/vagrant/.ssh/authorized_keys
    echo #{ssh_pub_key} > /root/.ssh/authorized_keys
    SCRIPT

  end

  config.vm.provider :virtualbox do |virtualbox|

    virtualbox.gui = false

    virtualbox.customize ['modifyvm', :id, '--audio', 'none']

    virtualbox.memory = 4096
    virtualbox.cpus = 2

  end

  config.vm.define "alpha" do |alpha|

    alpha.vm.hostname = "alpha.test"

    alpha.vm.network :private_network, ip: "192.168.56.10"

  end

  config.vm.define "beta" do |beta|

    beta.vm.hostname = "beta.test"

    beta.vm.network :private_network, ip: "192.168.56.11"

  end

end
