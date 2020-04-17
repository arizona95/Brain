from math import ceil


class Pagination(object):
    """
    Attributes:
        page (int): Page
        per_page (int): The number of items for each page
        total (int): The total number of whole items
    """

    def __init__(self, page, per_page, total):
        self.page = page
        self.per_page = per_page
        self.total = total

    @property
    def pages(self):
        return int(ceil(self.total / float(self.per_page)))

    @property
    def has_prev(self):
        return self.page > 1

    @property
    def has_next(self):
        return self.page < self.pages

    def iter_pages(self,
                   left_edge: int = 2,
                   left_current: int = 2,
                   right_current: int = 5,
                   right_edge: int = 2):
        """
        Iterates over the page numbers in the pagination.  The four parameters control the
        thresholds how many numbers should be produced from the sides.
        Skipped page numbers are represented as `None`.

        Yields:
            int: page number
        """
        last = 0
        for num in range(1, self.pages + 1):
            if (num <= left_edge
                or (self.page - left_current - 1 < num < self.page + right_current)
                or num > self.pages - right_edge):
                if last + 1 != num:
                    yield None
                yield num
                last = num
