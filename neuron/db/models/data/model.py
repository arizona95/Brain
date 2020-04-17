from sqlalchemy import Column, Text, Integer

from db.base import Base
from db.mixins import IdMixin, TimestampMixin

__all__ = ('Neuron',)


class Neuron(Base, IdMixin, TimestampMixin):
    name = Column(Text, nullable=False)
    modelPath = Column(Text, nullable=False)

