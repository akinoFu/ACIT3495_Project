import connexion
from connexion import NoContent
import yaml
import datetime
from sqlalchemy import create_engine, null, func, true
from sqlalchemy.orm import sessionmaker
from apscheduler.schedulers.background import BackgroundScheduler
from grades import GradeItem
from base import Base
import pymongo
from pymongo import MongoClient

with open("app_conf.yml", "r") as f:
    app_config = yaml.safe_load(f.read())
mysql_env = app_config["mysql"]
mongo_env = app_config["mongodb"]


MYSQL_ENGINE = create_engine(f"mysql+pymysql://{mysql_env['user']}:{mysql_env['password']}@{mysql_env['hostname']}:{mysql_env['port']}/{mysql_env['db']}")
Base.metadata.bind = MYSQL_ENGINE
MYSQL_SESSION = sessionmaker(bind=MYSQL_ENGINE)

MONGO_CLIENT = pymongo.MongoClient(f"mongodb://{mongo_env['user']}:{mongo_env['password']}@{mongo_env['hostname']}:{mongo_env['port']}/")


def populate_stats():
    """ Periodically update analystics """
    mysql_data = get_mysql_data()
    update_mongo(mysql_data)


def update_mongo(mysql_data):
    mydb = MONGO_CLIENT[mongo_env['db']]
    mycol = mydb[mongo_env['collection']]

    for item in mysql_data:
        myquery = { "name": item["name"] }
        newvalues = { "$set": { "max": item["max"], "min": item["min"], "avg": item["avg"]}}
        mycol.update_one(myquery, newvalues, upsert=True)

    print(f"{datetime.datetime.now()} - Mongo DB Updataed")
    for x in mycol.find():
        print(x)


def get_mysql_data():
    """ Get mysql data """
    session = MYSQL_SESSION()
    results = session.query(GradeItem.name, func.max(GradeItem.grade), func.min(GradeItem.grade), func.avg(GradeItem.grade)).group_by(GradeItem.name).all()
    session.close()

    result_list = []
    for result in results:
        dic = {'name': result[0],
               'max': result[1],
               'min': result[2],
               'avg': float(result[3])}
        result_list.append(dic)
    return result_list

def init_scheduler():
    sched = BackgroundScheduler(daemon=True)
    sched.add_job(populate_stats,
                  'interval',
                  seconds=app_config['scheduler']['period_sec'])
    sched.start()


app = connexion.FlaskApp(__name__, specification_dir='')

if __name__ == "__main__":
    init_scheduler()
    app.run(port=8080, use_reloader=False)