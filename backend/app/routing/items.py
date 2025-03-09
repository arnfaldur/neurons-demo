from fastapi import APIRouter, Depends, HTTPException
from psycopg.cursor import Cursor
from pydantic import BaseModel

from ..database import get_db

router = APIRouter(tags=["items"])


class Inventory(BaseModel):
    water: int = 0
    food: int = 0
    medication: int = 0
    ammunition: int = 0

    def value(self):
        return (
            self.water * 4 + self.food * 3 + self.medication * 2 + self.ammunition * 1
        )

    def is_valid(self):
        """Checks if Inventory contains less than zero of some item"""
        for k in self.__dict__:
            if self.__dict__[k] < 0:
                return False
        return True

    def contains(self, other: "Inventory") -> bool:
        """check if `self` contains equal or more of all items than `other` contains"""
        for k in self.__dict__:
            if self.__dict__[k] < other.__dict__[k]:
                return False
        return True


class Trade(BaseModel):
    trader_id: int
    offered: Inventory
    requested: Inventory

    def is_fair(self):
        return self.offered.value() == self.requested.value()


# This is a GET request that returns an object that states if a survivor is infected
@router.get("/{survivor_id}/inventory")
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
@router.post("/{survivor_id}/trade")
async def survivor_trade(survivor_id: int, trade: Trade, cur: Cursor = Depends(get_db)):
    if survivor_id == trade.trader_id:
        raise HTTPException(400, "A survivor can't trade with themselves")

    if not trade.offered.is_valid():
        raise HTTPException(400, "Invalid trade: negative amount of items offered")

    if not trade.requested.is_valid():
        raise HTTPException(400, "Invalid trade: negative amount of items requested")

    if not trade.is_fair():
        raise HTTPException(
            400,
            f"Unfair trade, offered value: {trade.offered.value()}, requested value: {trade.requested.value()}",
        )

    # get and check survivor's inventory
    cur.execute(
        "SELECT water, food, medication, ammunition FROM survivors WHERE id = %s",
        (survivor_id,),
    )
    survivor_inventory = Inventory(**cur.fetchone())  # type: ignore
    if not survivor_inventory.contains(trade.requested):
        raise HTTPException(400, "Survivor doesn't have requested items")

    # get and check trader's inventory
    cur.execute(
        "SELECT water, food, medication, ammunition FROM survivors WHERE id = %s",
        (trade.trader_id,),
    )
    trader_inventory = Inventory(**cur.fetchone())  # type: ignore
    if not trader_inventory.contains(trade.offered):
        raise HTTPException(400, "Trader doesn't have offered items")

    # update inventory contents
    cur.execute(
        """UPDATE survivors SET
           water = water - %(water)s,
           food = food - %(food)s,
           medication = medication - %(medication)s,
           ammunition = ammunition - %(ammunition)s
        WHERE id = %(id)s""",
        {**trade.requested.__dict__, "id": survivor_id},
    )

    cur.execute(
        """UPDATE survivors SET
           water = water - %(water)s,
           food = food - %(food)s,
           medication = medication - %(medication)s,
           ammunition = ammunition - %(ammunition)s
        WHERE id = %(id)s""",
        {**trade.offered.__dict__, "id": trade.trader_id},
    )
