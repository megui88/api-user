API User  [![Build Status](https://travis-ci.org/megui88/api-user.svg?branch=master)](https://travis-ci.org/megui88/api-user)
=======

### Please, it is necessary to have
* docker:  [Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntu/) or [Mac](https://docs.docker.com/docker-for-mac/install/)
* docker-compose [Ubuntu](https://docs.docker.com/compose/install/) 

## First steps
```
git clone git@github.com:megui/api-user.git
cd api-user
cp src/.env.dist src/.env
docker-compose build
docker-compose up -d
exit
```
Go to: [localhost](http://localhost:3000/) 

## Usage

Just run `cd api-user; docker-compose up -d`, then: