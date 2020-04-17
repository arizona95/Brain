import time

from sqlalchemy import Column, Integer
from db.query import IMQuery


class IdMixin(object):
    query: IMQuery
    id = Column(Integer, primary_key=True, autoincrement=True)

    @classmethod
    def get(cls, _id):
        if (isinstance(_id, str) and _id.isdigit()) or isinstance(_id, (int, float,)):
            return cls.query.get(int(_id))

    @classmethod
    def by_id(cls, query=None, _id=None):
        if _id is None:
            raise TypeError("by_id() missing 1 required positional argument: '_id'")
        if query is None:
            query = cls.query
        return query.filter(cls.id == _id)


class TimestampMixin(object):
    created_at = Column(
        Integer,
        default=lambda: int(time.time()),
        nullable=False
    )
    updated_at = Column(
        Integer,
        default=lambda: int(time.time()),
        onupdate=lambda: int(time.time()),
        nullable=False
    )
