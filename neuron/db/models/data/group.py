from sqlalchemy import Column, Text, JSON

from db.base import Base
from db.mixins import IdMixin, TimestampMixin

__all__ = ('Group',)


class Group(Base, IdMixin, TimestampMixin):
    name = Column(Text, nullable=False)
    groupPath = Column(Text, nullable=False)

