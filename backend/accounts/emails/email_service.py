from django.template.loader import render_to_string
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, Subject
from config.settings import SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, APP_URL


def send_welcome_email(to_email, username):
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

    except Exception as e:
        print(f"Error sending email: {e}")
