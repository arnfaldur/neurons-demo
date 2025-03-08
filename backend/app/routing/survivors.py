from fastapi import APIRouter, Depends
from psycopg.cursor import Cursor
from pydantic import BaseModel

from ..database import get_db

from . import infection


router = APIRouter(tags=["survivors"])

router.include_router(infection.router, prefix="")


class Survivor(BaseModel):
    name: str
    age: int
    gender: str
    last_location: tuple[float, float]
    infected: bool = False
    water: int = 0
    food: int = 0
    medication: int = 0
    ammunition: int = 0


@router.get("")
async def get_survivors(cur: Cursor = Depends(get_db)):
    cur.execute("SELECT * from survivors")
    return cur.fetchall()


@router.get("/{survivor_id}")
async def get_survivor(survivor_id: int, cur: Cursor = Depends(get_db)):
    cur.execute("SELECT * from survivors WHERE id = %s", (survivor_id,))
    survivor = cur.fetchone()
    return survivor


@router.post("")
async def create_survivor(survivor: Survivor, cur: Cursor = Depends(get_db)):
    cur.execute(
        "INSERT INTO survivors (name, age, gender, last_location) VALUES (%s, %s, %s, %s) RETURNING id",
        (survivor.name, survivor.age, survivor.gender, survivor.last_location),
    )
    if survivor := cur.fetchone():  # type: ignore
        return survivor
    return None


@router.put("/{survivor_id}")
async def survivors_update(
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


# This is POST request that takes a location as a pair of numbers and
# updates the survivor's location with the new pair
@router.post("/{survivor_id}/location")
async def survivors_update_location(
    survivor_id: int, location: tuple[float, float], cur: Cursor = Depends(get_db)
):
    cur.execute(
        "UPDATE survivors SET last_location = %s WHERE id = %s",
        (
            location,
            survivor_id,
        ),
    )
