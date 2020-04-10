import psycopg2

# establish connection
try:
    conn = psycopg2.connect(
        "dbname='pms' user='arpit' host='localhost' password='1let2me3in'")
except:
    print("I am unable to connect to the database")

# create cursor to work with

cur = conn.cursor()
cur.execute("insert into users values (%s) ",["kaushal10","Kaushal","Patil","passWord1","kaushal.p@gmail.com"])
print(cur.statusmessage)

cur.commit()

cur.execute("Select * from users")
rows = cur.fetchall()
print(rows)
