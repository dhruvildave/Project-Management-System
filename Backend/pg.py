import psycopg2 as db
from collections import namedtuple
# establish connection

Status_tuple = namedtuple("Status", ["success", "msg"])


def executequery(sql, data):
    DSN = "dbname='pms' user='arpit' host='localhost' password='1let2me3in'"
    try:
        with db.connect(DSN) as conn:

            try:
                with conn.cursor() as cur:
                    cur.execute(sql, data)
                    print(cur.query)

            except Exception as e:
                return False, e.pgerror
            else:
                return True, "Query Executed Succesfully"
    except db.OperationalError as e:
        return False, e.pgerror
