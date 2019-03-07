#
# Node.js runtime Dockerfile
#
# https://github.com/dockerfile/nodejs-runtime
#

# Pull base image.
FROM dockerfile/nodejs

# Set instructions on build.
ONBUILD ADD package.json /app/
ONBUILD RUN npm install

# Define working directory.
WORKDIR /app

# Define default command.
CMD ["npm", "start"]

# Expose ports.
EXPOSE 3000