import psycopg2
from db.config import connection
from models.update_model import Item_for_update


async def update_data(item: Item_for_update):
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(**connection)
        cur = conn.cursor()
        cur.execute('''UPDATE client SET status = %s WHERE account_number = %s;''',
                    (item.status, item.accountNumber))
        conn.commit()
        return True
    except (Exception, psycopg2.DatabaseError) as error:
        return {"message": error}
    finally:
        cur.close()
        conn.close()
