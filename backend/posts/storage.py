from django.core.files.storage import Storage
from django.conf import settings
from typing import BinaryIO, Optional
import requests
import os


class MediaStorage(Storage):
    """
    Custom storage class for handling media files through Nginx.
    Implements basic storage operations using HTTP methods.
    """

    def __init__(self) -> None:
        """Initialize storage with base URL from settings."""
        self.base_url = settings.MEDIA_URL

    def _create_directory(self, directory: str) -> bool:
        """
        Create a directory in the storage using MKCOL request.

        Args:
            directory: Path of the directory to create

        Returns:
            bool: True if directory was created or already exists
        """
        url = f"{self.base_url}{directory}/"
        response = requests.request("MKCOL", url)

        return response.status_code in [201, 204, 405]

    def _save(self, name: str, content: BinaryIO) -> str:
        """
        Save a file to the storage.

        Args:
            name: Name/path for the file
            content: File-like object containing the file data

        Returns:
            str: Name of the saved file

        Raises:
            IOError: If directory creation or file save fails
        """
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

    def url(self, name: Optional[str]) -> str:
        """
        Get the URL for accessing a file.

        Args:
            name: Name/path of the file

        Returns:
            str: Complete URL for accessing the file
        """
        return f"{self.base_url}{name}"

    def exists(self, name: str) -> bool:
        """
        Check if a file exists in storage.

        Args:
            name: Name/path of the file to check

        Returns:
            bool: True if file exists, False otherwise
        """
        url = f"{self.base_url}{name}"
        response = requests.head(url)

        return response.status_code == 200

    def delete(self, name: str) -> None:
        """
        Delete a file from storage.

        Args:
            name: Name/path of the file to delete
        """
        url = f"{self.base_url}{name}"
        requests.delete(url)
