from typing import Annotated, Optional
from fastapi import FastAPI, Header, HTTPException
from db.get_from_db import get_data_from_db, data_of_user
from jwt_users import generate_jwt_token, decode_jwt_token
from models.login_model import Login

app = FastAPI()


@app.post("/login")
async def login(man: Login):
    response = data_of_user(man)
    if response is False:
        HTTPException(status_code=404, detail="No such user")
    return {"jwt": generate_jwt_token(response)}


@app.get("/get/table")
async def get_client(authorization: Annotated[Optional[str], Header()] = None):
    if authorization is None:
        HTTPException(status_code=401, detail="Not Authorized")
    fio = decode_jwt_token(authorization.split(" ")[1])["fio"]
    response = await get_data_from_db(fio)
    return response


@app.post("/update/accounts")
async def update_accounts():
    pass
