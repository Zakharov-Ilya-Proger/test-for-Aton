import psycopg2
from db.config import connection
from models.login_model import Login


async def data_of_user(login: Login):
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(**connection)
        cur = conn.cursor()
        cur.execute('''SELECT * FROM public.user WHERE login = %s AND password = %s''',
                    (login.login, login.password,))
        data = cur.fetchone()
        if data is None:
            return False
        return {"fio": data[0], "login": data[1], "password": data[2]}
    except (Exception, psycopg2.DatabaseError) as error:
        return {"message": error}
    finally:
        cur.close()
        conn.close()


async def get_data_from_db(fio):
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(**connection)
        cur = conn.cursor()
        cur.execute('''SELECT * FROM client WHERE responsible_person = %s ORDER BY account_number''', (fio,))

        data = cur.fetchall()
        if data is None:
            return {"message": "This user have no clients"}
        result = [{"accountNumber": row[0],
                   "surname": row[1],
                   "name": row[2],
                   "middleName": row[3],
                   "birthday": row[4],
                   "INN": row[5],
                   "responsiblePerson": row[6],
                   "status": row[7]}
                  for row in data]
        return result
    except (Exception, psycopg2.DatabaseError) as error:
        return {"error": error}
    finally:
        cur.close()
        conn.close()
