from fastapi import Depends, FastAPI
from psycopg.cursor import Cursor
from pydantic import BaseModel

from .database import get_db


app = FastAPI(
    title="ZSSN API",
    description="An API for the Zombie Survival Social Network",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"message": "Welcome to the end of the world"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}


class Survivor(BaseModel):
    name: str
    age: int
    gender: str
    last_location: tuple[float, float]


@app.get("/survivor/{survivor_id}")
async def survivor_get(survivor_id: int, cur: Cursor = Depends(get_db)):
    cur.execute("SELECT * from survivors WHERE id = %s", (survivor_id,))
    survivor = cur.fetchone()
    return survivor


@app.post("/survivor")
async def survivor_post(survivor: Survivor, cur: Cursor = Depends(get_db)):
    cur.execute(
        "INSERT INTO survivors (name, age, gender, last_location) VALUES (%s, %s, %s, %s) RETURNING id",
        (survivor.name, survivor.age, survivor.gender, survivor.last_location),
    )
    if survivor := cur.fetchone():  # type: ignore
        return survivor
    return None


@app.patch("/survivor/{survivor_id}")
async def survivor_update(
    survivor_id: int, survivor: Survivor, cur: Cursor = Depends(get_db)
):
    cur.execute(
        "UPDATE survivors SET name = %s, age = %s, gender = %s, last_location = %s WHERE id = %s",
        (
            survivor.name,
            survivor.age,
            survivor.gender,
            survivor.last_location,
            survivor_id,
        ),
    )


@app.patch("/survivor/{survivor_id}/update_location")
async def survivor_update_location(
    survivor_id: int, location: tuple[float, float], cur: Cursor = Depends(get_db)
):
    cur.execute(
        "UPDATE survivors SET last_location = %s WHERE id = %s",
        (
            location,
            survivor_id,
        ),
    )
