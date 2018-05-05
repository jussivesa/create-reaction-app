##############################################################################
# meteor-dev stage - builds image for dev and used with docker-compose.yml
##############################################################################

# replaced
# FROM reactioncommerce/base:v4.0.1 as meteor-dev

FROM node:8.9.4

ARG METEOR_VERSION=1.6.1
ARG NAME=base
ARG DESCRIPTION="Base Docker image for Reaction."
ARG URL=https://github.com/reactioncommerce/base
ARG DOC_URL=https://github.com/reactioncommerce/base
ARG VCS_URL=https://github.com/reactioncommerce/base
ARG VCS_REF
ARG VENDOR
ARG BUILD_DATE
ARG BUILD_COMPARE_URL
ARG BUILD_ENV=test
ARG BUILD_NUMBER
ARG BUILD_PLATFORM
ARG BUILD_PLATFORM_PROJECT_USERNAME
ARG BUILD_PLATFORM_PROJECT_REPONAME
ARG BUILD_PULL_REQUESTS
ARG BUILD_TRIGGERED_BY_TAG
ARG BUILD_URL
ARG CIRCLE_WORKSPACE_ID
ARG CIRCLE_WORKFLOW_ID
ARG CIRCLE_WORKFLOW_JOB_ID
ARG CIRCLE_WORKFLOW_UPSTREAM_JOB_IDS
ARG CIRCLE_WORKSPACE_ID
ARG GIT_REPOSITORY_URL
ARG GIT_SHA1
ARG LICENSE

LABEL maintainer="Reaction Commerce <engineering@reactioncommerce.com>" \
      com.reactioncommerce.build-date=$BUILD_DATE \
      com.reactioncommerce.name=$NAME \
      com.reactioncommerce.description=$DESCRIPTION \
      com.reactioncommerce.url=$URL \
      com.reactioncommerce.vcs-url=$VCS_URL \
      com.reactioncommerce.vcs-ref=$VCS_REF \
      com.reactioncommerce.vendor=$VENDOR \
      com.reactioncommerce.docker.build.compare-url=$BUILD_COMPARE_URL \
      com.reactioncommerce.docker.build.number=$BUILD_NUMBER \
      com.reactioncommerce.docker.build.platform=$BUILD_PLATFORM \
      com.reactioncommerce.docker.build.platform.project.username=$BUILD_PLATFORM_PROJECT_USERNAME \
      com.reactioncommerce.docker.build.platform.project.reponame=$BUILD_PLATFORM_PROJECT_REPONAME \
      com.reactioncommerce.docker.build.pull-requests=$BUILD_PULL_REQUESTS \
      com.reactioncommerce.docker.build.triggered-by-tag=$BUILD_TRIGGERED_BY_TAG \
      com.reactioncommerce.docker.build.url=$BUILD_URL \
      com.reactioncommerce.docker.build.circle.workflow.id=$CIRCLE_WORKFLOW_ID \
      com.reactioncommerce.docker.build.circle.workflow.job.id=$CIRCLE_WORKFLOW_JOB_ID \
      com.reactioncommerce.docker.build.circle.workflow.upstream.job.ids=$CIRCLE_WORKFLOW_UPSTREAM_JOB_IDS \
      com.reactioncommerce.docker.build.circle.workflow.url=https://circleci.com/workflow-run/$CIRCLE_WORKFLOW_ID \
      com.reactioncommerce.docker.build.circle.workspace.id=$CIRCLE_WORKSPACE_ID \
      com.reactioncommerce.docker.git.repository.url=$GIT_REPOSITORY_URL \
      com.reactioncommerce.docker.git.sha1=$GIT_SHA1 \
      com.reactioncommerce.docker.license=$LICENSE

ENV METEOR_VERSION $METEOR_VERSION
ENV REACTION_DOCKER_BUILD true
ENV APP_SOURCE_DIR /opt/reaction/src
ENV APP_BUNDLE_DIR /opt/reaction/dist
ENV PATH $PATH:/home/node/.meteor

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
  build-essential \
  bsdtar \
  bzip2 \
  ca-certificates \
  git \
  python \
  wget \
 && rm -rf /var/lib/apt/lists/*

RUN mkdir -p "$APP_SOURCE_DIR" \
 && mkdir -p "$APP_BUNDLE_DIR" \
 && chown -R node "$APP_SOURCE_DIR" \
 && chown -R node "$APP_BUNDLE_DIR"

RUN npm i -g github:jussivesa/reaction-cli#development
# RUN npm i -g reaction-cli

USER node

################################
# install-meteor
# replaces tar command with bsdtar in the install script (bsdtar -xf "$TARBALL_FILE" -C "$INSTALL_TMPDIR")
# https://github.com/jshimko/meteor-launchpad/issues/39
################################
RUN wget -O /tmp/install_meteor.sh https://install.meteor.com \
 && sed -i.bak "s/RELEASE=.*/RELEASE=\"$METEOR_VERSION\"/g" /tmp/install_meteor.sh \
 && sed -i.bak "s/tar -xzf.*/bsdtar -xf \"\$TARBALL_FILE\" -C \"\$INSTALL_TMPDIR\"/g" /tmp/install_meteor.sh \
 && printf "\\n[-] Installing Meteor %s...\\n" "$METEOR_VERSION" \
 && sh /tmp/install_meteor.sh \
 && rm /tmp/install_meteor.sh

WORKDIR $APP_SOURCE_DIR
COPY /.create-reaction-app/dockerfile-test.sh .
# Node flags for the Meteor build tool
ONBUILD ARG TOOL_NODE_FLAGS
ONBUILD ENV TOOL_NODE_FLAGS $TOOL_NODE_FLAGS


# defauls
LABEL maintainer="Reaction Commerce <architecture@reactioncommerce.com>"

ENV PATH $PATH:/home/node/.meteor

COPY --chown=node package.json $APP_SOURCE_DIR/

RUN meteor npm install

COPY --chown=node . $APP_SOURCE_DIR

##############################################################################
# builder stage - builds the production bundle
##############################################################################
# FROM meteor-dev as builder

# Version key/value should be on his own line
RUN cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g'

RUN create-reaction-app --version

# TODO Hangs here because of package name
RUN printf "\\n[-] Running Reaction plugin loader...\\n" \
 && create-reaction-app plugins load

RUN printf "\\n[-] Building Meteor application...\\n" \
 && meteor build --server-only --architecture os.linux.x86_64 --directory "$APP_BUNDLE_DIR"

WORKDIR $APP_BUNDLE_DIR/bundle/programs/server/

RUN meteor npm install --production


##############################################################################
# final build stage - create the final production image
##############################################################################
FROM node:8.9.4-slim

# Default environment variables
ENV ROOT_URL "http://localhost"
ENV PORT 3000

# grab the dependencies and built app from the previous builder image
COPY --chown=node --from=builder /opt/reaction/dist/bundle /app

WORKDIR /app

EXPOSE 3000

CMD ["node", "main.js"]
