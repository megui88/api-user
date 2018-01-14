#API User  
[![Test Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]


### Please, it is necessary to have
* docker:  [Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntu/) or [Mac](https://docs.docker.com/docker-for-mac/install/)
* docker-compose [Ubuntu](https://docs.docker.com/compose/install/) 

## First steps
```
git clone git@github.com:developmentsoftware/api-user.git
cd api-user
cp src/.env.dist src/.env
docker-compose build
docker-compose up -d
exit
```
Go to: [localhost](http://localhost:3000/) 

## Usage

Just run `cd api-user; docker-compose up -d`, then:

[travis-image]: https://img.shields.io/travis/developmentsoftware/api-user/master.svg
[travis-url]: https://travis-ci.org/developmentsoftware/api-user
[coveralls-image]: https://coveralls.io/repos/github/developmentsoftware/api-user/badge.svg
[coveralls-url]: https://coveralls.io/github/developmentsoftware/api-user
