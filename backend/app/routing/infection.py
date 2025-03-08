from fastapi import APIRouter, Depends, HTTPException
from psycopg.cursor import Cursor
from pydantic import BaseModel

from ..database import get_db

router = APIRouter(tags=["infection"])

class Accuser(BaseModel):
    accuser_id: int


# This is a GET request that returns an object that states if a survivor is infected
@router.get("/{survivor_id}/infection")
async def is_survivor_infected(survivor_id: int, cur: Cursor = Depends(get_db)):
    accusations = cur.execute(
        "SELECT count(accuser_id) FROM survivors_infection_accusations WHERE accused_id = %s",
        (survivor_id,),
    )
    if accusation := accusations.fetchone():
        return {"infected": accusation["count"] >= 3}
    return {"infected": False}


# This is a POST request that registers an accusation of an infection
# it takes an Accuser object containing the id of the accusing survivor
@router.post("/{accused_id}/infection")
async def accuse_survivor_of_infection(
    accused_id: int, accuser: Accuser, cur: Cursor = Depends(get_db)
):
    if accused_id == accuser.accuser_id:
        raise HTTPException(400, "A survivor can't accuse themselves")

    existing_accusation = cur.execute(
        "SELECT * FROM survivors_infection_accusations WHERE accuser_id = %s AND accused_id = %s",
        (accuser.accuser_id, accused_id),
    )
    if existing_accusation.fetchone() is None:
        cur.execute(
            "INSERT INTO survivors_infection_accusations (accuser_id, accused_id) VALUES (%s, %s)",
            (accuser.accuser_id, accused_id),
        )
    else:
        raise HTTPException(409, "Infection accusation already registered")
