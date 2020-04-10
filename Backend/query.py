import psycopg2 as db

DSN = "dbname='pms' user='arpit' host='localhost' password='1let2me3in'"
# establish connection


def createUser(username: str,
               fisrstname: str,
               lastname: str,
               password: str,
               email: str,
               profilepic=None):
    sql = "INSERT INTO users VALUES (%s,%s,%s,%s,%s,%s)"
    data = [username, fisrstname, lastname, password, email, profilepic]
    try:
        with db.connect(DSN) as conn:

            try:
                with conn.cursor() as cur:
                    cur.execute(sql, data)
                    print(cur.query)

            except:
                print("failed to add user")

    except db.OperationalError:
        print("connection failed")


def allUsers():
    sql = "SELECT * from users"
    try:
        with db.connect(DSN) as conn:

            try:
                with conn.cursor() as cur:
                    cur.execute(sql)
                    print(cur.query)
                    rows = cur.fetchall()
                    return rows
            except:
                print("failed to add user")

    except db.OperationalError:
        print("connection failed")


if __name__ == "__main__":
    #createUser('_$arpit2', 'Arpit', 'Vaghela', '', 'dhruvildave@ahduni.edu.in')
    print(allUsers())
