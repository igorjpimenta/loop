from .dynamic_template_data import DynamicTemplateData
from typing import Optional, Tuple, TypedDict


class EmailObject(TypedDict, total=False):
    email: str
    name: str


class Email:
    def __init__(
        self,
        email: Optional[str] = None,
        name: Optional[str] = None,
        substitutions: Optional[str] = None,
        subject: Optional[str] = None,
        p: int = 0,
        dynamic_template_data: Optional[DynamicTemplateData] = None
    ) -> None: ...

    @property
    def name(self) -> Optional[str]: ...

    @name.setter
    def name(self, value: str) -> None: ...

    @property
    def email(self) -> Optional[str]: ...

    @email.setter
    def email(self, value: str) -> None: ...

    @property
    def substitutions(self) -> Optional[str]: ...

    @substitutions.setter
    def substitutions(self, value: str) -> None: ...

    @property
    def dynamic_template_data(self) -> Optional[DynamicTemplateData]: ...

    @dynamic_template_data.setter
    def dynamic_template_data(self, value: DynamicTemplateData) -> None: ...

    @property
    def subject(self) -> Optional[str]: ...

    @subject.setter
    def subject(self, value: str) -> None: ...

    @property
    def personalization(self) -> int: ...

    @personalization.setter
    def personalization(self, value: int) -> None: ...

    def parse_email(
        self, email_info: str) -> Tuple[Optional[str], Optional[str]]: ...

    def get(self) -> EmailObject: ...
