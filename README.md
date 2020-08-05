# covid-slayer
Simple game for slaying covid

## Requirements

Docker and Git

## Usage

Clone this repo to host machine where docker and git is installed.

```bash
git clone https://github.com/squidbomb/covid-slayer.git
```

cd into [folder-where-you-cloned-this-repo]

```bash
docker volume create mongodata
docker network create covid_slayer_backend
docker-compose up -d
```

Check if the server has started

```bash
docker logs -f covid-slayer
```

That's it for now :)

## License
[MIT](https://choosealicense.com/licenses/mit/)
