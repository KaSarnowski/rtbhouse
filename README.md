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

# "Adding" new users
The easiest way to add a new user is to open new page in incognito mode - it opens a new browser session, otherwise one user will be "logged in" for an hour, or until a session closes.

## Stay in touch

- Author - [Kamil Sarnowski](https://www.linkedin.com/in/kamil-sarnowski-developer/)
- Email - [ka.sarnowski@gmail.com](mailto:ka.sarnowski@gmail.com)
