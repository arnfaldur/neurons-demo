
# Neurons Zombie Survival Social Network Demo

## Technologies

This is a full-stack project that utilizes a FastAPI based Python backend,
managing a PostgreSQL database. No ORM was used, ony SQL statement interpolation.
The frontend combines React, Tanstack (Router and Query), Material UI and Typescript.

## Project structure

The project is a monorepo consisting of the backend and frontend folders,
as well as a few docker compose files.

## Running the project

The easiest way to try the site out is to use docker compose.

### Docker

If you navigate to the root directory and run:

``` sh
docker compose up --build
```

it will set up a production ready configuration,
running Nginx to serve the static, client-side rendered web application.

After that you should be able to try out the website at `https://localhost:3000`.
If port 3000 is occupied and you can't free it up, contact me,
or edit the docker compose file, `frontend/Dockerfile`, as well as the `CORSMiddleware` in `./backend/app/main.py` with a different port.

It's advisable to run `docker compose down` after using any of the `docker compose up` commands to avoid conflicts.

To run the test suite, execute:

``` sh
docker compose -f docker-compose.test.yaml up --build
```

Remembering to `docker compose -f docker-compose.test.yaml down` afterwards.

Finally, if you want to hack on the project, run:

``` sh
docker compose -f docker-compose.dev.yaml up --build
```

to start a dev server.

### Manually

This is the approach I used the most througout development, due to it's flexibility.
Setting up a PostgreSQL database directly on a computer
is a little painful so I used docker for that.

``` nushell
(docker run --replace --name testing-postgres 
  -e POSTGRES_PASSWORD=postgres
  -e POSTGRES_USER=postgres
  -e POSTGRES_DB=neurons
  -p 5432:5432 
  -v postgres_data:/var/lib/postgresql/data 
  -d docker.io/library/postgres)
```

Although it takes a little care to avoid 
volume and port conflicts with the `docker compose` setups.

#### Backend

Then the python backend is set up with this sequence:

```sh
cd backend
uv venv # creates .venv
uv pip install -r requirements.txt
```

This requires the very powerful tool `uv` but using regular python venvs is almost identical.

Then you can start developing with:

```sh
.venv/bin/fastapi dev
```

And I like to keep a file watcher, that triggers the test suite on every change, active.

``` sh
ls app/**/*.py | entr .venv/bin/pytest
```

#### Frontend

I use `pnpm` instead of `npm` because it can save quite a bit of space.
If you have many different repositories on disk.

``` sh
# starting from root
cd frontend/app
pnpm i
pnpm dev
```

Which starts a dev server on `http://localhost:3000`.
This port number is required to be 3000 because the backend expects it.

