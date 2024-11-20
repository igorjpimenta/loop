from django.template.loader import render_to_string
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, Subject
from config.settings import SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, APP_URL
import logging

logger = logging.getLogger(__name__)


def send_welcome_email(to_email, username):
    """Send a welcome email to the user."""
    if not username:
        raise ValueError("Username is required")

    message = Mail(
        from_email=From(SENDGRID_FROM_EMAIL),
        to_emails=to_email,
        subject=Subject('Welcome to Loop!'),
        html_content=render_to_string(
            'welcome_email.html',
            {'username': username, 'domain': APP_URL}
        )
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        return response.status_code

    except KeyError as e:
        logger.error(f"Error sending email: Invalid param {e}")

    except Exception as e:
        logger.error(f"Error sending email: {e}")
