from .custom_arg import CustomArg
from .email import Email
from .header import Header
from .substitution import Substitution
from typing import List, Type, Dict, Any, TypedDict


class PersonalizationObject(TypedDict, total=False):
    tos: List[Type[Email]]
    ccs: List[Type[Email]]
    bccs: List[Type[Email]]
    from_email: Type[Email]
    subject: str
    send_at: int
    dynamic_template_data: Dict[str, Any]
    headers: Header
    substitutions: List[Substitution]
    custom_args: List[CustomArg]


class Personalization:
    def __init__(self) -> None: ...

    def add_email(self, email: Type[Email]) -> None: ...

    def _get_unique_recipients(
        self, recipients: List[Type[Email]]
    ) -> List[Type[Email]]: ...

    @property
    def tos(self) -> List[Type[Email]]: ...

    @tos.setter
    def tos(self, value: List[Type[Email]]) -> None: ...

    def add_to(self, email: Type[Email]) -> None: ...

    @property
    def from_email(self) -> Type[Email]: ...

    @from_email.setter
    def from_email(self, value: Type[Email]) -> None: ...

    def set_from(self, email: Type[Email]) -> None: ...

    @property
    def ccs(self) -> List[Type[Email]]: ...

    @ccs.setter
    def ccs(self, value: List[Type[Email]]) -> None: ...

    def add_cc(self, email: Type[Email]) -> None: ...

    @property
    def bccs(self) -> List[Type[Email]]: ...

    @bccs.setter
    def bccs(self, value: List[Type[Email]]) -> None: ...

    def add_bcc(self, email: Type[Email]) -> None: ...

    @property
    def subject(self) -> str: ...

    @subject.setter
    def subject(self, value: str) -> None: ...

    @property
    def headers(self) -> List[Type[Header]]: ...

    @headers.setter
    def headers(self, value: List[Type[Header]]) -> None: ...

    def add_header(self, header: Type[Header]) -> None: ...

    @property
    def substitutions(self) -> List[Type[Substitution]]: ...

    @substitutions.setter
    def substitutions(self, value: List[Substitution]) -> None: ...

    def add_substitution(self, substitution: Substitution) -> None: ...

    @property
    def custom_args(self) -> List[CustomArg]: ...

    @custom_args.setter
    def custom_args(self, value: List[CustomArg]) -> None: ...

    def add_custom_arg(self, custom_arg: CustomArg) -> None: ...

    @property
    def send_at(self) -> int: ...

    @send_at.setter
    def send_at(self, value: int) -> None: ...

    @property
    def dynamic_template_data(self) -> Dict[str, Any]: ...

    @dynamic_template_data.setter
    def dynamic_template_data(self, value: Dict[str, Any]) -> None: ...

    def get(self) -> Dict[str, Any]: ...
