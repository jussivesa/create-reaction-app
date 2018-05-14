#!/bin/bash

_CONNECTION=`node -p "require('./config.json').remote.connection.ssh"`
_REMOTE_USER=`node -p "require('./config.json').remote.user.name"`
_PW=`node -p "require('./config.json').remote.user.password"`
_VCS_USER=`node -p "require('./config.json').vcs.user"`
_VCS_EMAIL=`node -p "require('./config.json').vcs.email"`
_VCS_PW=`node -p "require('./config.json').vcs.password"`

# config
REMOTE_USER=_REMOTE_USER
SUDO_PW=_PW
APP_DIR=reaction
SSH_URL=`ssh `_CONNECTION
VCS=git
VCS_REPO=reaction
VSC_USER=_VCS_USER
VCS_PW=_VCS_PW
VCS_URL=https://{VCS_USER}:{VCS_PW}@github.com/{VCS_USER}/{VCS_REPO}
SERVE_DIR=/users/{_REMOTE_USER}/apps/reaction/public
SERVE_HOST=http://localhost:3000

# install git
apt-get install -y --no-install-recommends git
# git configs
git config --local user.name "Deploy Bot"
git config --local user.email deploybot@noreply.com

# scrips
## fetch
echo {VCS} pull {VCS_URL}
## install common packages
apt-get update
apt-get install -y --no-install-recommends nodejs npm build-essential bzip2 curl ca-certificates python
### update npm
sudo npm install -g npm
### update node to newest stable version e.g. 9.8.0
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
### mondogb install
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
apt-get install -y mongodb-org

### meteor install
curl https://install.meteor.com/ | sh

# Create reaction app cli
npm install -g git://github.com/jussivesa/reaction-cli.git 
## tests
reaction test
npm run e2e
npm run unit

# ssh connection
echo SSH_URL
cd ~./users/jussi/apps/{APP_DIR}

# login as SU
sudo -i | {SUDO_PW}

## make backup of old build dir
cd .. | cp ./{APP_DIR} ./{COPY_DIR}/{COPY_NAME} # check this, create new dir with copy_name ?
## build
create-reaction-app build
## copy to public dir
cp ./{APP_DIR}/build ./{SERVE_DIR}
## restart ngninx
service ngninx restart
## re-create SSL
## test if site responds
if [ curl {SERVE_HOST} = "curl: (7) Couldn't connect to server" ]; then 
    echo "Could not connect to Reaction app"
    # use backup
    cp ./{COPY_DIR}/{COPY_NAME} ./{APP_DIR}/build
    service ngninx restart

    # reset git configs
    git config --local user.name _VSC_USER
    git config --local user.email _VCS_EMAIL
    exit
else
    echo "App alive"
    # reset git configs
    git config --local user.name _VSC_USER
    git config --local user.email _VCS_EMAIL

    exit
fi;