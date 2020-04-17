import logging


def turn_off_alchemy_log():
    logger = logging.getLogger('sqlalchemy.engine.base.Engine')
    [logger.removeHandler(handler) for handler in logger.handlers]
    logger.addHandler(logging.NullHandler())
