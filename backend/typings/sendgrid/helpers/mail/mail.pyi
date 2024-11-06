# flake8: noqa: E501

from .asm import Asm
from .attachment import Attachment
from .batch_id import BatchId
from .category import Category
from .content import Content
from .custom_arg import CustomArg
from .dynamic_template_data import DynamicTemplateData
from .email import Email
from .from_email import From
from .header import Header
from .ip_pool_name import IpPoolName
from .mail_settings import MailSettings
from .mime_type import MimeType
from .personalization import Personalization
from .reply_to import ReplyTo
from .section import Section
from .send_at import SendAt
from .subject import Subject
from .substitution import Substitution
from .template_id import TemplateId
from .tracking_settings import TrackingSettings
from typing import TypedDict, Union, Tuple, Optional, List, Dict, Any, Type


MailObject = TypedDict('MailObject', {
    "from": From,
    "subject": Subject,
    "personalizations": List[Personalization],
    "content": List[Content],
    "attachments": List[Attachment],
    "template_id": TemplateId,
    "sections": List[Section],
    "categories": List[Category],
    "custom_args": List[CustomArg],
    "send_at": SendAt,
    "batch_id": BatchId,
    "asm": Asm,
    "ip_pool_name": IpPoolName,
    "mail_settings": MailSettings,
    "tracking_settings": TrackingSettings,
    "reply_to": ReplyTo,
    "reply_to_list": List[ReplyTo],
})


class Mail:
    def __init__(
        self,
        from_email: Optional[Union[From, Tuple[From, ...]]] = None,
        to_emails: Optional[Union[Email, str, Tuple[Union[str, Email], ...], List[Union[Tuple[Union[str, Email], ...], Email, str]]]] = None,
        subject: Optional[Subject] = None,
        plain_text_content: Optional[Type[Content]] = None,
        html_content: Optional[Union[Type[Content], str]] = None,
        amp_html_content: Optional[Type[Content]] = None,
        global_substitutions: Optional[str] = None,
        is_multiple: bool = False
    ) -> None: ...

    def __str__(self) -> str: ...

    def _ensure_append(
        self,
        new_items: List[Dict[str, Any]],
        append_to: List,
        index: int = 0
    ) -> List[Dict[str, Any]]: ...

    def _ensure_insert(
        self,
        new_items: List[Dict[str, Any]],
        insert_to: List
    ) -> List[Dict[str, Any]]: ...

    def _flatten_dicts(
        self, dicts: List[Dict[str, Any]]) -> Dict[str, Any]: ...

    def _get_or_none(
        self, from_obj: Dict[str, Any]) -> Optional[Dict[str, Any]]: ...

    def _set_emails(
        self,
        emails: Union[Email, List[Email]],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Optional[int] = None
    ) -> None: ...

    def personalizations(self) -> List[Personalization]: ...

    def add_personalization(
        self, personalization: Personalization, index: int = 0
    ) -> None: ...

    @property
    def to(self) -> None: ...

    @to.setter
    def to(
        self,
        to_emails: Union[Email, str, Tuple[Union[str, Email], ...], List[Union[Tuple[Union[str, Email], ...], Email, str]]],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Optional[Union[Personalization, int]] = 0
    ) -> None: ...

    def add_to(
        self,
        to_email: Union[Email, str, Tuple[Union[str, Email], ...], List[Union[Tuple[Union[str, Email], ...], Email, str]]],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Union[Personalization, int] = 0
    ) -> None: ...

    @property
    def cc(self) -> None: ...

    @cc.setter
    def cc(
        self,
        cc_emails: Union[str, Tuple[str, ...], List[Union[Tuple[str, ...], str]]],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Union[Personalization, int] = 0
    ) -> None: ...

    def add_cc(
        self,
        cc_email: Union[str, Tuple[Union[str, Email]], Email],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Union[Personalization, int] = 0
    ) -> None: ...

    @property
    def bcc(self) -> None: ...

    @bcc.setter
    def bcc(
        self,
        cc_emails: Union[str, Tuple[str, ...], List[Union[Tuple[str, ...], str]]],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Union[Personalization, int] = 0
    ) -> None: ...

    def add_bcc(
        self,
        bcc_email: Union[str, Tuple[Union[str, Email]], Email],
        global_substitutions: Optional[Dict[str, Any]] = None,
        is_multiple: bool = False,
        p: Union[Personalization, int] = 0
    ) -> None: ...

    @property
    def subject(self) -> Subject: ...

    @subject.setter
    def subject(self, value: Union[Subject, str]) -> None: ...

    @property
    def headers(self) -> None: ...

    @headers.setter
    def headers(self, value: Union[Header,
                List[Header], Dict[str, Any]]) -> None: ...

    def add_header(self, header: Union[Header, Dict[str, Any]]) -> None: ...

    @property
    def substitutions(self) -> None: ...

    @substitutions.setter
    def substitutions(
        self, value: Union[Substitution, List[Substitution]]) -> None: ...

    def add_substitution(
        self, substitution: Union[Substitution, Dict[str, Any]]) -> None: ...

    @property
    def custom_args(self) -> List[CustomArg]: ...

    @custom_args.setter
    def custom_args(
        self, value: Union[CustomArg, List[CustomArg]]) -> None: ...

    @property
    def custom_arg(self) -> CustomArg: ...

    @custom_arg.setter
    def custom_arg(self, value: CustomArg) -> None: ...

    def add_custom_arg(self, custom_arg: CustomArg) -> None: ...

    @property
    def send_at(self) -> SendAt: ...

    @send_at.setter
    def send_at(self, value: SendAt) -> None: ...

    @property
    def dynamic_template_data(self) -> DynamicTemplateData: ...

    @dynamic_template_data.setter
    def dynamic_template_data(self, value: DynamicTemplateData) -> None: ...

    @property
    def from_email(self) -> From: ...

    @from_email.setter
    def from_email(
        self,
        value: Union[Email, str, Tuple[Union[str, Email]]]
    ) -> None: ...

    @property
    def reply_to(self) -> ReplyTo: ...

    @reply_to.setter
    def reply_to(
        self,
        value: Union[Email, str, Tuple[Union[str, Email]]]
    ) -> None: ...

    @property
    def reply_to_list(self) -> List[ReplyTo]: ...

    @reply_to_list.setter
    def reply_to_list(
        self, value: Union[List[ReplyTo], Tuple[ReplyTo, ...]]) -> None: ...

    @property
    def contents(self) -> List[Content]: ...

    @property
    def content(self) -> None: ...

    @content.setter
    def content(self, value: Union[Content, List[Content]]) -> None: ...

    def add_content(
        self,
        content: Union[Content, Dict[str, Any]],
        mime_type: Optional[Union[MimeType, str]] = None
    ) -> None: ...

    @property
    def attachments(self) -> List[Attachment]: ...

    @property
    def attachment(self) -> None: ...

    @attachment.setter
    def attachment(
        self, value: Union[Attachment, List[Attachment]]) -> None: ...

    def add_attachment(self, attachment: Attachment) -> None: ...

    @property
    def template_id(self) -> TemplateId: ...

    @template_id.setter
    def template_id(self, value: TemplateId) -> None: ...

    @property
    def sections(self) -> List[Section]: ...

    @property
    def section(self) -> None: ...

    @section.setter
    def section(self, value: Union[Section, List[Section]]) -> None: ...

    def add_section(self, section: Section) -> None: ...

    @property
    def categories(self) -> List[Category]: ...

    @categories.setter
    def categories(self, value: Union[Category, List[Category]]) -> None: ...

    def add_category(self, category: Category) -> None: ...

    @property
    def batch_id(self) -> BatchId: ...

    @batch_id.setter
    def batch_id(self, value: BatchId) -> None: ...

    @property
    def asm(self) -> Asm: ...

    @asm.setter
    def asm(self, value: Asm) -> None: ...

    @property
    def ip_pool_name(self) -> IpPoolName: ...

    @ip_pool_name.setter
    def ip_pool_name(self, value: IpPoolName) -> None: ...

    @property
    def mail_settings(self) -> MailSettings: ...

    @mail_settings.setter
    def mail_settings(self, value: MailSettings) -> None: ...

    @property
    def tracking_settings(self) -> TrackingSettings: ...

    @tracking_settings.setter
    def tracking_settings(self, value: TrackingSettings) -> None: ...

    def get(self) -> MailObject: ...

    @classmethod
    def from_EmailMessage(cls, message: Mail) -> Mail: ...
