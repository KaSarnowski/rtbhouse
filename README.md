Development Test for RTB House
===================

## Running the app

Enter the `docker` directory and prepare the `.env` file:
```bash
$ cp .env.dist .env
```
Edit the `.env` file and set the `REPO_DIRECTORY` variable to the repo absolute location.

```bash
# example
REPO_DIRECTORY=/home/user_directory/projects/RTB_House
```

Then run:

```bash
$ docker compose build
$ docker compose up -d
```

# Accessing the app
if everything went fine, the app should be accessible at `http://127.0.2.1/`

## Stay in touch

- Author - [Kamil Sarnowski](https://www.linkedin.com/in/kamil-sarnowski-developer/)
- Email - [ka.sarnowski@gmail.com](mailto:ka.sarnowski@gmail.com)
