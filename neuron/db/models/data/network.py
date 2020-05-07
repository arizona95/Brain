from sqlalchemy import Column, Text, JSON

from db.base import Base
from db.mixins import IdMixin, TimestampMixin

__all__ = ('Network',)


class Network(Base, IdMixin, TimestampMixin):
    name = Column(Text, nullable=False)
    modelPath = Column(Text, nullable=False)

