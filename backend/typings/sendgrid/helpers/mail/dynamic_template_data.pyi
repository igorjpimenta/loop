from typing import Optional, Dict, Any


class DynamicTemplateData:
    def __init__(
        self,
        dynamic_template_data: Optional[Dict[str, Any]] = None,
        p: int = 0
    ) -> None: ...

    @property
    def dynamic_template_data(self) -> Optional[Dict[str, Any]]: ...

    @dynamic_template_data.setter
    def dynamic_template_data(self, value: Dict[str, Any]) -> None: ...

    @property
    def personalization(self) -> int: ...

    @personalization.setter
    def personalization(self, value: int) -> None: ...

    def __str__(self) -> str: ...

    def get(self) -> Dict[str, Any]: ...
