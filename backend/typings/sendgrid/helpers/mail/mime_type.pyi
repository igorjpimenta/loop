from typing import TypedDict, Literal


class MimeType(TypedDict):
    text: Literal["text/plain"]
    html: Literal["text/html"]
    amp: Literal["text/x-amp-html"]
