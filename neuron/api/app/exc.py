# -*- coding:utf-8 -*-
from werkzeug.exceptions import HTTPException

from api.app import status

__all__ = ('APIError', 'InvalidParameterError', 'FormError',)


class APIError(HTTPException):
    code = status.HTTP_500_INTERNAL_SERVER_ERROR
    description = ('Server Error has occurred. Try it again. '
                   'If it happen again, please notify to organizers.')

    def __init__(self, message=None, code=None):
        if message is not None:
            self.description = message
        if code is not None:
            self.code = code

    def __str__(self):
        return self.description


class InvalidParameterError(APIError):
    code = status.HTTP_400_BAD_REQUEST
    description = 'Bad Request'


class FormError(APIError):
    def __init__(self, message, code=status.HTTP_400_BAD_REQUEST):
        super(FormError, self).__init__(message, code)
