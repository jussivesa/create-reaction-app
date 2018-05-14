# remove previously installed node
brew uninstall node
# clean all broken symlinks
brew prune
# install brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# update
brew update
# add path to bash_profile
export PATH="/usr/local/bin:$PATH"
# install node & npm
brew install node
# git
brew install git

# meteor
curl https://install.meteor.com/ | sh

# open file limit
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536 65536
echo "ulimit -n 65536 65536" >> .bashrc
source .bashrc

# reaction cli
npm install -g git://github.com/jussivesa/reaction-cli.git

# move to project dir
cd ..

# install reaction deps, start dev server 
create-reaction-app

echo "All setup! To start new project, run 'create-reaction-app init my-awesome-project'"

exit