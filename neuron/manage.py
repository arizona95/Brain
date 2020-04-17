from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager, Shell
from sqlalchemy_utils import create_database, database_exists, drop_database

from api.app.wsgi import app
from api.manage import manager as api_command
from config import app_config
from db.base import Base, database_uri, db_engine
from utils.sqlalchemy import turn_off_alchemy_log


def make_context():
    from db.base import db_session
    from sqlalchemy import orm

    models = __import__('db.models', globals=globals(), locals=locals(), fromlist=['*'])
    context = dict(
        app=app,
        config=app_config,
        db_engine=db_engine,
        db_session=db_session,
        contains_eager=orm.contains_eager,
        joinedload=orm.joinedload,
        joinedload_all=orm.joinedload_all,
        aliased=orm.aliased,
    )
    for model in [models]:
        for key in dir(model):
            context[key] = getattr(model, key)
    return context


banner = u'\n'.join(
    [
        u"%-15s: %s" % (u'ENV', app_config.ENV),
        u"%-15s: %s" % (u'DB_ENGINE', db_engine)
    ]
)
migrate = Migrate(app, db_engine)
manager = Manager(app)
manager.add_command('db', MigrateCommand)
manager.add_command('api', api_command)
manager.add_command(
    'shell',
    Shell(banner=banner, make_context=make_context, use_ipython=False, use_bpython=False),
)


@manager.command
def initdb():
    turn_off_alchemy_log()
    print("[*] Creating database...", end='')
    if not database_exists(database_uri):
        create_database(database_uri)
    Base.metadata.create_all(bind=db_engine)
    print("Done")


@manager.command
def dropdb():
    turn_off_alchemy_log()
    print("[*] Dropping database...", end='')
    if database_exists(database_uri):
        drop_database(database_uri)
    print("Done")


@manager.command
def resetdb():
    dropdb()
    initdb()


@manager.command
def load_fixtures():
    from fixtures import initial_make
    initial_make.main()


@manager.command
def dowoo(name=None):
    print('dowoo %s' % name)


if __name__ == '__main__':
    manager.run()
