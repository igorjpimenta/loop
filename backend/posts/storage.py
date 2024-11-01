from django.core.files.storage import Storage
from django.conf import settings
import requests
import os


class MediaStorage(Storage):
    def __init__(self):
        self.base_url = settings.MEDIA_URL

    def _create_directory(self, directory):
        url = f"{self.base_url}{directory}/"
        response = requests.request("MKCOL", url)

        return response.status_code in [201, 204, 405]

    def _save(self, name, content):
        directory = os.path.dirname(name)
        if directory:
            if not self._create_directory(directory):
                raise IOError(f"Failed to create directory: {directory}")

        url = f"{self.base_url}{name}"

        content.seek(0)
        file_content = content.read()

        headers = {
            'Content-Type': 'application/octet-stream',
        }

        response = requests.put(url, data=file_content, headers=headers)
        if response.status_code not in [200, 201, 204]:
            print(url)
            raise IOError(
                f"Failed to save file to Nginx: {response.text}"
            )

        return name

    def url(self, name):
        return f"{self.base_url}{name}"

    def exists(self, name):
        url = f"{self.base_url}{name}"
        response = requests.head(url)

        return response.status_code == 200

    def delete(self, name):
        url = f"{self.base_url}{name}"
        requests.delete(url)
