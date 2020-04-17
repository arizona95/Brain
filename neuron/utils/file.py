import os
from typing import Tuple
from uuid import uuid4

from config import app_config
from utils.env import is_development, is_testing


def get_default_upload_dir(uuid: str = None) -> Tuple[str, str]:
    if uuid is None:
        uuid = str(uuid4())

    if is_development() or is_testing():
        return os.path.join(app_config.UPLOAD_DIR, uuid), uuid
    return os.path.join('upload', uuid), uuid


def get_url(filename: str, uuid: str):
    upload_dir, uuid = get_default_upload_dir(uuid)
    if is_development() or is_testing():
        url = '/static' + upload_dir.split('/static')[1]
        return os.path.join(url, filename)
    raise NotImplementedError('You should get a url from Storage Service like S3.')


def save_file(file_, filename: str, upload_dir: str = None, uuid: str = None):
    if upload_dir is None:
        upload_dir, uuid = get_default_upload_dir(uuid)

    if is_development() or is_testing():
        os.makedirs(upload_dir, exist_ok=True)
        path = os.path.join(upload_dir, filename)
        with open(path, 'wb') as f:
            file_.seek(0)
            f.write(file_.read())
    else:
        raise NotImplementedError('You should upload a file using Storage Service like S3.')

    return uuid
