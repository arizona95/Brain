from typing import Union

import inflection
from colorama import Fore, Style
from sqlalchemy import MetaData, create_engine
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.ext.declarative import declared_attr, declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, Session
from sqlalchemy.util import OrderedSet
from sqlalchemy_utils import force_auto_coercion

from config import app_config
from db.query import IMQuery

database_uri = app_config.SQLALCHEMY_DATABASE_URI
echo = app_config.SQLALCHEMY_ECHO
db_engine = create_engine(
    database_uri,
    echo=echo,
)
db_session: Union[Session, scoped_session] = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
        bind=db_engine,
        query_cls=IMQuery,
    )
)


def import_models():
    __import__('db.models', fromlist=['*'])
    force_auto_coercion()


class DeclarativeBase(object):
    exclude_modules = OrderedSet(['db', 'models'])

    @declared_attr
    def __tablename__(self):
        """Returns snake_case table name
        """

        names = self.__module__.split('.') + inflection.underscore(self.__name__).split('_')
        names = list(OrderedSet(names) - self.exclude_modules)
        names[-1] = inflection.pluralize(names[-1])
        return '_'.join(names)


class Base(declarative_base(cls=DeclarativeBase), object):
    __abstract__ = True
    metadata = MetaData()
    query = db_session.query_property()

    @classmethod
    def create(cls, **kwargs):
        # noinspection PyArgumentList
        instance = cls(**kwargs)
        return instance.save(False)

    @classmethod
    def commit(cls):
        try:
            db_session.commit()
        except Exception as e:
            db_session.rollback()
            raise e

    def save(self, commit=False):
        db_session.add(self)
        if commit:
            try:
                db_session.commit()
            except InvalidRequestError:
                pass
            except Exception as e:
                db_session.rollback()
                raise e
        return self

    def delete(self, commit=True):
        db_session.delete(self)
        if commit:
            try:
                db_session.commit()
            except Exception as e:
                db_session.rollback()
                raise e


import_models()

if echo:
    import sys
    import logging

    logger = logging.getLogger('sqlalchemy.engine.base.Engine')
    logger.setLevel(logging.INFO)
    for handler in logger.handlers:
        logger.removeHandler(handler)
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        ''.join([
            Style.BRIGHT,
            Fore.MAGENTA,
            '%(asctime)s: ',
            Fore.CYAN,
            '%(message)s',
            Fore.RESET,
            Style.RESET_ALL
        ])
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
