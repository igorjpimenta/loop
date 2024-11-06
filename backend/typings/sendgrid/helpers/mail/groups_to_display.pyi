from typing import Optional, List


class GroupsToDisplay:
    def __init__(
        self,
        groups_to_display: Optional[List[int]] = None
    ) -> None: ...

    @property
    def groups_to_display(self) -> List[int]: ...

    @groups_to_display.setter
    def groups_to_display(self, value: List[int]) -> None: ...

    def get(self) -> List[int]: ...
