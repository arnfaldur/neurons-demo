from fastapi import APIRouter, Depends
from psycopg.cursor import Cursor
from pydantic import BaseModel

from ..database import get_db

from .items import Inventory


router = APIRouter(tags=["survivors"])


class Survivor(BaseModel):
    id: int = 0
    name: str
    age: int
    gender: str
    last_location: tuple[float, float]
    inventory: Inventory | None = None

    @classmethod
    def from_dict(cls, data) -> "Survivor":
        inventory = Inventory(**{k: data[k] for k in Inventory.model_fields})
        return cls(
            **{k: data[k] for k in cls.model_fields if k != "inventory"},
            inventory=inventory,
        )


@router.get("", response_model=list[Survivor])
async def get_survivors(cur: Cursor = Depends(get_db)):
    # This should be paginated using URL props
    cur.execute("SELECT * from survivors")
    return list(map(Survivor.from_dict, cur.fetchall()))


@router.get("/{survivor_id}")
async def get_survivor(survivor_id: int, cur: Cursor = Depends(get_db)):
    cur.execute("SELECT * from survivors WHERE id = %s", (survivor_id,))
    survivor = cur.fetchone()
    return Survivor.from_dict(survivor)


@router.post("")
async def create_survivor(survivor: Survivor, cur: Cursor = Depends(get_db)):
    if survivor.inventory is None:
        cur.execute(
            "INSERT INTO survivors (name, age, gender, last_location) VALUES (%s, %s, %s, %s) RETURNING id",
            (survivor.name, survivor.age, survivor.gender, survivor.last_location),
        )
    else:
        cur.execute(
            """INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                survivor.name,
                survivor.age,
                survivor.gender,
                survivor.last_location,
                *dict(survivor.inventory).values(),
            ),
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


@router.delete("/{survivor_id}")
async def survivors_delete(survivor_id: int, cur: Cursor = Depends(get_db)):
    cur.execute(
        "DELETE FROM survivors WHERE id = %s",
        (survivor_id,),
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
