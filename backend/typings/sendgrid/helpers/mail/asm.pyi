from .group_id import GroupId
from .groups_to_display import GroupsToDisplay
from typing import Union, Optional, List, TypedDict


class AsmObject(TypedDict, total=False):
    group_id: GroupId
    groups_to_display: GroupsToDisplay


class Asm:
    def __init__(
        self,
        group_id: Union[GroupId, int],
        groups_to_display: Optional[Union[GroupsToDisplay, List[int]]] = None
    ) -> None: ...

    @property
    def group_id(self) -> Union[GroupId, int]: ...

    @group_id.setter
    def group_id(self, value: Union[GroupId, int]) -> None: ...

    @property
    def groups_to_display(self) -> Union[GroupsToDisplay, List[int]]: ...

    @groups_to_display.setter
    def groups_to_display(
        self, value: Union[GroupsToDisplay, List[int]]
    ) -> None: ...

    def get(self) -> AsmObject: ...
