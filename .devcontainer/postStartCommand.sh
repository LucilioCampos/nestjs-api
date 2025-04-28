[ ! -d $HOME/.ssh ] && mkdir $HOME/.ssh
sudo su -c "cp /mnt/host_ssh/* $HOME/.ssh/"

sudo su -c "cp /mnt/host_gitconfig $HOME/.gitconfig"

sudo chown -R $USER:$USER . $HOME/.ssh $HOME/.gitconfig

npx prisma migrate dev