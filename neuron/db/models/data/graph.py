from sqlalchemy import Column, Text, JSON

from db.base import Base
from db.mixins import IdMixin, TimestampMixin

__all__ = ('Graph',)


class Graph(Base, IdMixin, TimestampMixin):
    name = Column(Text, nullable=False)
    parameter = Column(JSON, nullable=False)

