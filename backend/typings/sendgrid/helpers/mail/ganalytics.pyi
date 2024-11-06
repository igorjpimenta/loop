from typing import Optional, Any, TypedDict


class GanalyticsObject(TypedDict, total=False):
    enable: bool
    utm_source: str
    utm_medium: str
    utm_term: str
    utm_content: str
    utm_campaign: str


class Ganalytics:
    def __init__(
        self,
        enable: Optional[bool] = None,
        utm_source: Optional[str] = None,
        utm_medium: Optional[str] = None,
        utm_term: Optional[str] = None,
        utm_content: Optional[str] = None,
        utm_campaign: Optional[str] = None,
    ) -> None: ...

    def __set_field(self, field: str, value: Any) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def utm_source(self) -> str: ...

    @utm_source.setter
    def utm_source(self, value: str) -> None: ...

    @property
    def utm_medium(self) -> str: ...

    @utm_medium.setter
    def utm_medium(self, value: str) -> None: ...

    @property
    def utm_term(self) -> str: ...

    @utm_term.setter
    def utm_term(self, value: str) -> None: ...

    @property
    def utm_content(self) -> str: ...

    @utm_content.setter
    def utm_content(self, value: str) -> None: ...

    @property
    def utm_campaign(self) -> str: ...

    @utm_campaign.setter
    def utm_campaign(self, value: str) -> None: ...

    def get(self) -> GanalyticsObject: ...
