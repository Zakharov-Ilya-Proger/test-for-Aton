from typing import Annotated, Optional
from fastapi import FastAPI, Header, HTTPException
from starlette.middleware.cors import CORSMiddleware
from db.get_from_db import get_data_from_db, data_of_user
from db.update_data import update_data
from jwt_users import generate_jwt_token, decode_jwt_token
from models.login_model import Login
from models.update_model import Update

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешает все источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешает все методы
    allow_headers=["*"],  # Разрешает все заголовки
)


@app.post("/login")
async def login(man: Login):
    response = await data_of_user(man)
    if response is False:
        HTTPException(status_code=404, detail="No such user")
    return {"jwt": generate_jwt_token(response)}


@app.get("/get/table")
async def get_client(authorization: Annotated[Optional[str], Header()] = None):
    token = authorization.split(" ")[1]
    if token is None:
        HTTPException(status_code=401, detail="Not Authorized")
    fio = decode_jwt_token(authorization.split(" ")[1])["fio"]
    response = await get_data_from_db(fio)
    return response


@app.post("/update/accounts")
async def update_accounts(items: Update, authorization: Annotated[Optional[str], Header()] = None):
    token = authorization.split(" ")[1]
    if token is None:
        HTTPException(status_code=401, detail="Not Authorized")
    for item in items.accounts:
        result = await update_data(item)
        if not result:
            HTTPException(status_code=500, detail=str(result))
    HTTPException(status_code=200, detail="All status uptodate")
