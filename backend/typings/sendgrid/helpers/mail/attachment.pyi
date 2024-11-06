from .file_content import FileContent
from .file_name import FileName
from .file_type import FileType
from .disposition import Disposition
from .content_id import ContentId
from typing import Union, Optional, TypedDict


class AttachmentObject(TypedDict, total=False):
    content: FileContent
    type: FileType
    filename: FileName
    disposition: Disposition
    content_id: ContentId


class Attachment:
    def __init__(
        self,
        file_content: Union[FileContent, str],
        file_name: Union[FileName, str],
        file_type: Optional[Union[FileType, str]] = None,
        disposition: Optional[Union[Disposition, str]] = None,
        content_id: Optional[Union[ContentId, str]] = None
    ) -> None: ...

    @property
    def file_content(self) -> FileContent: ...

    @file_content.setter
    def file_content(self, value: Union[FileContent, str]) -> None: ...

    @property
    def file_name(self) -> FileName: ...

    @file_name.setter
    def file_name(self, value: Union[FileName, str]) -> None: ...

    @property
    def file_type(self) -> FileType: ...

    @file_type.setter
    def file_type(self, value: Optional[Union[FileType, str]]) -> None: ...

    @property
    def disposition(self) -> Disposition: ...

    @disposition.setter
    def disposition(
        self, value: Optional[Union[Disposition, str]]) -> None: ...

    @property
    def content_id(self) -> ContentId: ...

    @content_id.setter
    def content_id(self, value: Optional[Union[ContentId, str]]) -> None: ...

    def get(self) -> dict: ...
