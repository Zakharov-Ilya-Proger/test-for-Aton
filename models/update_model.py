from typing import List

from pydantic import BaseModel


class Item_for_update(BaseModel):
    accountNumber: int
    status: str


class Update(BaseModel):
    accounts: List[Item_for_update] = []
