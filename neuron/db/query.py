from functools import partial
from typing import Any, Callable

from marshmallow import Schema
from sqlalchemy.orm import Query

from utils import pagination


class Pagination(pagination.Pagination):
    def __init__(self,
                 query: 'IMQuery',
                 page: int,
                 per_page: int,
                 total: int,
                 items: list = None,
                 schema: Schema = None):
        self.query = query
        self.page = page
        self.per_page = per_page
        self.total = total
        self.items = items
        self.item_schema = schema

    def to_dict(self):
        items = []
        if self.item_schema is not None:
            items = self.item_schema.dump(self.items)

        return dict(
            items=items,
            page=self.page,
            pages=self.pages,
            has_prev=self.has_prev,
            has_next=self.has_next,
            items_per_page=self.per_page,
        )

    def prev(self):
        return self.query.paginate(self.page - 1, self.per_page)

    def next(self, ):
        return self.query.paginate(self.page + 1, self.per_page)


class IMQuery(Query):

    def __getattr__(self, attr: str) -> Callable or Any:
        """
        Override __getattr__ to support chaining of class methods that return query object.
        This functionality supports only methods has a name starts with `with_` or `by_.

        Args:
            attr (str): attribute

        Returns:
            self.`attr`
        """
        if attr.startswith('with_') or attr.startswith('by_'):
            mapper = self._bind_mapper()
            try:
                return partial(getattr(mapper.class_, attr), self)
            except AttributeError:
                pass
        return self.__getattribute__(attr)

    def get_one(self):
        rows = self.all()
        if rows:
            return rows[0]
        return None

    def paginate(self,
                 page: int = 1,
                 per_page: int = 20,
                 schema: Schema = None,
                 only_data: bool = False) -> Pagination:
        """
        Args:
            page (int): Page number
            per_page (int): Limit in the number of items per page
            schema (Schema): class:`Schema` to serialize items
            only_data (bool): Flag to return schema dump of the query result

        Returns:
            class:`Pagination` instance contains `per_page` items from page `page`.
        """
        items = self.limit(per_page).offset((page - 1) * per_page).all()

        if only_data:
            if schema is None:
                raise ValueError('scheme cannot be None when only_data is set True')
            return schema.dump(items)

        if not items and page != 1:
            return Pagination(self, page, per_page, 0, [], schema)

        # No need to count if we're on the first page and there are fewer items than we expected.
        if page == 1 and len(items) < per_page:
            total = len(items)
        else:
            total = self.order_by(None).count()

        return Pagination(self, page, per_page, total, items, schema)
