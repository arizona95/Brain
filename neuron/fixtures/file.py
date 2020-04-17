import cgi
import json
import mimetypes
import os
import platform
import tempfile
from typing import Optional

import requests

from config import app_config

__all__ = (
    'fixtures_data_dir',
    'download_file_from_google_drive',
    'decompress_7z',
)

fixtures_data_dir = os.path.join(app_config.PROJECT_ROOT, 'fixtures', 'data')
cache_path = os.path.join(fixtures_data_dir, 'cache.json')


def get_extension(content_type: Optional[str]) -> Optional[str]:
    """
    Convert Content-Type header value to file extension

    Args:
        content_type: Content-Type

    Returns:
        File extension
    """
    if content_type is None:
        return None
    return mimetypes.guess_extension(content_type)


def get_filename(content_disposition: Optional[str], extension: Optional[str]) -> Optional[str]:
    """
    Convert Content-Disposition header value to filename

    Args:
        content_disposition: Content-Disposition
        extension: File extension

    Returns:
        Filename
    """
    if content_disposition is None:
        return None

    value = {}
    try:
        header = cgi.parse_header(content_disposition)
        key, value = header
    except TypeError:
        pass

    filename = value.get('filename')
    if not filename:
        filename = tempfile.mktemp(dir=fixtures_data_dir)

    if extension and not filename.endswith(extension):
        filename += extension

    return filename


def get_cache(open_id: str, *, key: any) -> Optional[str]:
    """
    Load a file keyed by `open_id` if it exists

    Args:
        open_id: Open ID for the file as key
        key: Cache key

    Returns:
        File path
    """
    if not os.path.exists(cache_path):
        return None

    with open(cache_path, 'r') as f:
        downloads = json.load(f)

    cache = downloads.get(open_id)
    if cache is None or key not in cache:
        return None
    return os.path.join(fixtures_data_dir, cache[key])


def set_cache(open_id: str, *, key: str, value: any):
    """
    Save a pair of `open_id` and `filename` into `cache_path` as JSON

    Args:
        open_id: Open ID for the file as key
        key: Cache key
        value: Cache value
    """
    if not os.path.exists(cache_path):
        with open(cache_path, 'w') as f:
            f.write('{}')

    with open(cache_path, 'r') as f:
        downloads = json.load(f)
    downloads.setdefault(open_id, {})
    downloads[open_id][key] = value

    with open(cache_path, 'w') as f:
        json.dump(downloads, f)


def download_file_from_google_drive(open_id: str, cache: bool = True) -> Optional[str]:
    """
    Download a publicly accessible shared file from Google Drive

    Args:
        open_id: Open ID for the file
        cache: Try to get the file from local cache if True. Otherwise, False
    """
    if cache:
        cached_file_path = get_cache(open_id, key='filename')
        if cached_file_path is not None:
            return cached_file_path

    # Download from local if `cache` is True
    if cache and os.path.exists(cache_path):
        with open(cache_path, 'r') as f:
            histories = json.load(f)
        history = histories.get(open_id)
        if history is not None:
            return os.path.join(fixtures_data_dir, history['filename'])

    download_url = 'https://docs.google.com/uc'
    session = requests.Session()
    params = dict(id=open_id, authuser=0, export='download')
    response = session.get(download_url, params=params, stream=True)

    token = None
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            token = value

    if token is not None:
        params['confirm'] = token
        response = session.get(download_url, params=params, stream=True)

    if response.status_code != 200:
        return None

    ext = get_extension(response.headers.get('Content-Type'))
    filename = get_filename(response.headers.get('Content-Disposition'), ext)

    dest = os.path.join(fixtures_data_dir, filename)
    with open(dest, "wb") as f:
        for chunk in response.iter_content(1024 * 32):
            if chunk:
                f.write(chunk)

    if cache:
        set_cache(open_id, key='filename', value=filename)

    return dest


def decompress_7z(open_id, src_path: str, out_dir: str, *, cache=True):
    """
    Decompress given 7z

    Args:
        open_id: Open ID for the src file
        src_path: 7z file path
        out_dir: output directory where extracted files will place
        cache: Try to get extracted files from local cache if True. Otherwise, False
    """
    if cache:
        cached_out_dir = get_cache(open_id, key='out_dir')
        if cached_out_dir is not None and os.path.isdir(cached_out_dir):
            return cached_out_dir

    os_name = platform.system()
    if os_name == 'Darwin':
        decompressor_path = '/usr/local/bin/7za'
        if not os.access(decompressor_path, os.X_OK):
            raise EnvironmentError(f"{decompressor_path} is not installed. "
                                   f"run 'brew install p7zip'")
        # Extract in `out_dir` directory skipping extracting of existing files
        os.system(f'{decompressor_path} x {src_path} -aos -o{out_dir}')
    elif os_name == 'Linux':
        decompressor_path = '/usr/bin/7za'
        if not os.access(decompressor_path, os.X_OK):
            raise EnvironmentError(f"{decompressor_path} is not installed. "
                                   f"run 'sudo apt install -y p7zip-full'")
        os.system(f'{decompressor_path} x {src_path} -aos -o{out_dir}')
    else:
        if not os.path.isdir(out_dir):
            raise EnvironmentError(
                f"Decompressing {src_path} is not supported in Windows or Linux yet. "
                f"Decompress it manually and re-run the script."
            )

    if cache:
        set_cache(open_id, key='out_dir', value=out_dir)


