# create-reaction-app - Reaction Commerce made easy

create-reaction-app is a tool to quickly start a new realtime and reactive E-commerce JavaScript platform called **Reaction Commerce** with basic custom theme(s). It allows new Reaction Commerce users to easily understand the structure of custom themes and components. create-reaction-app also has powerful scripts to automate the development environment setup, and to deploy the e-commerce platform to your server fast.

## Key features
- Base theme with ready-made examples of custom components and styles
- Easy enough for Reaction Commerce beginners with advanced functionality for pros
- Stupidly easy scripts for the boring parts - setting up the env and deploying the app

## Requirements
- Mac or Linux OR Windows dev environment
- Some Linux distribution server (for deploying)
- Thats it! Everything else is taken care of by the scripts 🙌

## Version
Currently uses Reaction Commerce version 1.1.10. Output of `reaction --version`:
```
create-reaction-app: 0.0.3
create-reaction-app branch: development
Node: 9.8.0
NPM: 5.7.1
Meteor Node: 8.9.4
Meteor NPM: 5.6.0
Reaction CLI: 0.12.0
```

I will update the `create-reaction-app` with at least every minor update of Reaction Commerce and test that all of the features are working.

## Status
This package is still in development, and the repository is private for a while. When published as public, this package will contain new base theme(s) for Reaction Commerce, with automation scripts to setup env's and to publish the app to self-hosted servers.

# The boring part - Config
Make sure to edit the `config.json` found in `.create-reaction-app` folder. Make sure to follow the example format of the file, for the scripts to work.

# Development

## Setting the environment up 🎉

### Mac
Simply run:
```
./setup-mac-dev.sh
```
After that, you are all setup to start dev! Just run `reaction`. Happy coding!

### Linux
Todo

### Windows
Todo

## Multiple device testing

### Mac
You may want to test the local dev-build with multiple devices. I would recommend great tool called `ngrok` to tunnel the `localhost:port` site as public address to be accessible from tablet, phone or another device.

After downloading `ngrok`, use terminal to locate the `ngrok` executable and run command:

`./ngrok authtoken YOUR_TOKEN_HERE` where token is from ngrok website.

and to tunnel

`./ngrok http YOUR_PORT_HERE` where port is the port of where `create-reaction-app` is running, typically port 3000.

### Linux or Windows
I dont currently have anything to recommend for tunneling your localhost to public address like `ngrok` does on Mac. Have an suggestion? Please, do a pull request to this README.

## Build

### Windows
Todo

### Mac or common Linux distributions

# Publishing

## Publish �
If you dont have an SSH access to your server, look for help [here]().


## Before you get started
To run the scripts listed in `.create-reaction-app` -folder, you must generate or have existing SSH key for your machine to gain access to the remote server without password you wish to publish the create-reaction-app project. If you got stuck in any of these following steps, there is an awesome guide over at [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2).

### Mac or common Linux distributions

#### Step 0
Check if you already have an SSH key. To do so, on your **local** machine, run:
```
ls -la ~/.ssh
```

If the command lists files ending with `.pub` you likely already have a public SSH key. You may skip to step 3.

#### Step 1
To create new directory to store the SSH key(s) and also to open it, run:
```
mkdir -p ~/.ssh && cd ~/.ssh
```

#### Step 2 
To create the key, run:
```
ssh-keygen -t rsa
```
It will prompt you for name, and password for the files. Press `enter` three (3) times to skip these steps. The last lines of terminal output should look something like this:
```
The key fingerprint is:
SHA256:1xeAtlZz+bMYhVGqNqCqR9eX4cYogot1OnxhjPhWHuo jussivesa@Jussis-MacBook-Pro-2.local
The key's randomart image is:
+---[RSA 2048]----+
|   .o  .=oo..    |
|  .o o + B   .   |
| .o++ o & a .    |
| o=.Bo * = . .   |
|.+.R ++ S . .    |
|..= =. . = .     |
| . +    . +      |
|  V        .     |
|                 |
+----[SHA256]-----+
```


#### Step 3
To print the SSH key to the terminal, run:
```
more ~/.ssh/id_rsa.pub
```
Copy the printed text carefully (E.g. mark with mouse, right click and copy).

#### Step 4
Access the remote server via the regular root user. It will depend on your remote server and the way it is setup, but the command should look something like:
```
# replace the IP with yours
ssh root@192.168.1.1
# or use your server's domain name
ssh root@domain.com
```

If it is the first time you're connecting to the server, you will probably see message like one below. Just type `yes` and press `enter`.

```
The authenticity of host '192.168.1.1 (192.168.1.1)' can't be established.
ECDSA key fingerprint is
SHA256:bMYhVGqNqCqR9eX4cYogot1OnxhjPhWHuo.
Are you sure you want to continue connecting (yes/no)?
```

Now you should be connected to your server using root user. Next, we are going to add new user with the copied SSH key, and disabled root login.

#### Step 4
To add new user, run:
```
# replace your name with anything you like, but don't use root.
adduser yourname
```

Next, we need to add your new user to the super user group. To do so, run:
```
# again, same name here as before
usermod -aG sudo yourname
```

To verify, run:
```
id yourname
```

Output should look like this:
```
uid=1000(yourname) gid=1000(yourname) groups=1000(yourname),27(sudo)
```

#### Step 5
Add the SSH key to the new user. To do so, run:
```
su - yourname
mkdir ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```
Paste the earlier copied SSH key, right click and select paste.
To save text editing (nano) press `control + x`, type `y`, and press `enter`.

Finally, set permissions so only your new user may access the file. To do so, run:
```
chmod 600 ~/.ssh/authorized_keys
```

Exit and test the login with the new user (and without password using SSH keys!). Run:
```
# exit the previous session
exit
# test login, replace the IP with your server's or use domain name
ssh yourname@192.168.1.1
```

If everything went well, you should now be logged in with the new user. You may want to disable root login for better security, which I will recommend you to do. There is a lot of tutorials to do this, for example [How-To-Geek](https://www.howtogeek.com/howto/linux/security-tip-disable-root-ssh-login-on-linux/).

### Windows
TODO


# Contribute
Any contributions are greatly appreciated. However, all pull request for the main Reaction Commerce should be made to the main Reaction Commerce repository at [GitHub](https://github.com/reactioncommerce/reaction). Besides that, pull requests for files listed in directory `imports/plugins/custom/create-reaction-app` are most welcomed to be made to this repo.


# **!Note!** The install steps in the Reaction Docs are invalid and should not be mixed when using `create-reaction-app`

# Reaction Commerce Docs from Reaction repository

[![Circle CI](https://circleci.com/gh/reactioncommerce/reaction.svg?style=svg)](https://circleci.com/gh/reactioncommerce/reaction) [![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/reactioncommerce/reaction?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Open Source Helpers](https://www.codetriage.com/reactioncommerce/reaction/badges/users.svg)](https://www.codetriage.com/reactioncommerce/reaction)


[Reaction](http://reactioncommerce.com) is an event-driven, real-time reactive commerce platform built with JavaScript (ES6). It plays nicely with npm, Docker, and React.

![Reaction v.1.x](https://raw.githubusercontent.com/reactioncommerce/reaction-docs/master/assets/Reaction-Commerce-Illustration-BG-800px.png)

## Features

Reaction’s out-of-the-box core features include:

-   Drag-and-drop merchandising
-   Order processing
-   Payments
-   Shipping
-   Taxes
-   Discounts
-   Analytics
-   Integration with dozens of third-party apps
-   See full list of features on our [Roadmap](https://reactioncommerce.com/roadmap)

Since anything in our codebase can be extended, overwritten, or installed as a package, you may also develop, scale, and customize anything on our platform.

# Getting started

### Requirements

Reaction requires Meteor, Git, MongoDB, OS-specific build tools and optionally, ImageMagick. For step-by-step instructions, check out this [page](https://docs.reactioncommerce.com/reaction-docs/master/installation).

### Install and create your first store

Install the [Reaction CLI](https://github.com/reactioncommerce/reaction-cli) to get started with Reaction:

```bash
npm install -g reaction-cli
```

Create your store:

```bash
reaction init
cd reaction
reaction
```

You can also run the app locally using [`docker-compose`](https://docs.docker.com/compose/) by running:

```sh
docker-compose up
```

This will use the `docker-compose.yml` file. This can be used to evaluate the app locally (on all Operating Systems supported by Docker),
however, for active local development or customization, it is better to run `reaction` outside of Docker for faster app builds.

Learn more on how to [configure your project](https://docs.reactioncommerce.com/reaction-docs/master/configuration).

# Get involved

## Documentation and tools

-   [Developer documentation](https://docs.reactioncommerce.com)
-   [API documentation](http://api.docs.reactioncommerce.com)
-   [Reaction GraphQL API server base](https://github.com/reactioncommerce/reaction-api-base)
-   [Reaction sample data](https://github.com/reactioncommerce/reaction-sample-data)


## Get help

-   [Reaction Commerce Gitter chat](https://gitter.im/reactioncommerce/reaction)
-   [Reaction Commerce forum](https://forums.reactioncommerce.com/)

## Learn

-   [Reaction Commerce engineering blog posts](https://blog.reactioncommerce.com/tag/engineering/)
-   [Customization themes & plugins tutorial](https://docs.reactioncommerce.com/reaction-docs/master/tutorial)
-   [Reaction Commerce YouTube videos](https://www.youtube.com/user/reactioncommerce/videos)

## Contact the team

-   [Security reporting instructions](https://docs.reactioncommerce.com/reaction-docs/master/reporting-vulnerabilities): Report security vulnerabilities to <mailto:security@reactioncommerce.com>.
-   [Reaction community calls](http://getrxn.io/2rcCal): Join our biweekly community calls every other Wednesday at 7AM PST/10AM EST.
-   Subscribe to our [Reaction Community Google Calendar](http://getrxn.io/2rcCal) to RSVP to the next call and check out the [agenda](https://docs.google.com/document/d/1PwenrammgQJpQfFoUUJZ96i_JJYCM_4glAjB1_ZzgwA/edit?usp=sharing).
-   [Reaction Action](http://getrxn.io/2rcCal): RSVP for the monthly Reaction Action livestreams.

## Contribute

:star: Star us on GitHub — it helps!

We love your pull requests! Check our our [`Good First Issue`](https://github.com/reactioncommerce/reaction/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) and [`Help Wanted`](https://github.com/reactioncommerce/reaction/issues?q=label%3A%22help+wanted%22) tags for good issues to tackle.

Pull requests should:

- Pass linting tests: Run `npm run lint` to make sure you're following the [Reaction Code Style Guide](https://docs.reactioncommerce.com/reaction-docs/master/styleguide).
- Pass acceptance and unit tests: Run `reaction test` to confirm both [acceptance tests and unit tests](https://docs.reactioncommerce.com/reaction-docs/master/testing-reaction) are passing
- Have a link to the issue.

Get more details in our [Contributing Guide](https://docs.reactioncommerce.com/reaction-docs/master/contributing-to-reaction).


## Deploy on Docker

We ensure that all releases are deployable as [Docker](https://hub.docker.com/r/reactioncommerce/reaction/) containers. While we don't regularly test other methods of deployment, our community has documented deployment strategies for AWS, [Digital Ocean](https://gist.github.com/jshimko/745ca66748846551692e24c267a56060), and Galaxy. For an introduction to Docker deployment, the [Reaction deployment guide](https://docs.reactioncommerce.com/reaction-docs/master/deploying) has detailed examples.

We've included a demo [docker-compose file](https://github.com/reactioncommerce/reaction/blob/master/docker-compose-demo.yml) in the repository.
It shows how to use `mongo` as a service with your Reaction app. It can be used to do a demo of your production build by running this command:

```sh
docker-compose -f docker-compose-demo.yml up
```

You can also use this file as starting point for your production docker-compose setup.


### License

Copyright © [GNU General Public License v3.0](./LICENSE.md)
