from django.test import TestCase
from django.template.loader import render_to_string
from unittest.mock import patch, MagicMock
from accounts.emails.email_service import send_welcome_email
from sendgrid.helpers.mail import Mail
from django.conf import settings


class EmailServiceTests(TestCase):
    """Test suite for email service functionality."""

    def setUp(self):
        self.test_email = "test@example.com"
        self.test_username = "testuser"
        self.expected_html_content = render_to_string(
            'welcome_email.html',
            {
                'username': self.test_username,
                'domain': settings.APP_URL
            }
        )

    @patch('accounts.emails.email_service.SendGridAPIClient')
    def test_successful_welcome_email(self, mock_sendgrid):
        """Test successful welcome email sending."""
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 202
        mock_sendgrid.return_value.send.return_value = mock_response

        # Send email
        status_code = send_welcome_email(self.test_email, self.test_username)

        # Assertions
        self.assertEqual(status_code, 202)

        # Verify SendGrid client was initialized with correct API key
        mock_sendgrid.assert_called_once_with(settings.SENDGRID_API_KEY)

        # Verify send was called with correct Mail object
        send_call_args = mock_sendgrid.return_value.send.call_args[0][0]
        self.assertIsInstance(send_call_args, Mail)
        self.assertEqual(
            send_call_args.from_email.email,
            settings.SENDGRID_FROM_EMAIL
        )
        self.assertIn(
            self.test_email,
            [to.get('email') for p in send_call_args.personalizations
             for to in p.tos]
        )
        self.assertEqual(send_call_args.subject.subject, 'Welcome to Loop!')
        self.assertIn(
            self.expected_html_content,
            [c.content for c in send_call_args.contents]
        )

    @patch('accounts.emails.email_service.SendGridAPIClient')
    def test_failed_welcome_email(self, mock_sendgrid):
        """Test handling of failed email sending."""
        # Setup mock to raise an exception
        mock_sendgrid.return_value.send.side_effect = Exception("API Error")

        # Send email and capture printed output
        with self.assertLogs() as captured:
            status_code = send_welcome_email(
                self.test_email,
                self.test_username
            )

        # Assertions
        self.assertIsNone(status_code)  # Function should return None on error
        self.assertTrue(
            any("Error sending email: API Error" in output
                for output in captured.output)
        )

    @patch('accounts.emails.email_service.render_to_string')
    def test_email_template_rendering(self, mock_render):
        """Test email template rendering with correct context."""
        mock_render.return_value = "<html>Test Template</html>"

        with patch('accounts.emails.email_service.SendGridAPIClient'):
            send_welcome_email(self.test_email, self.test_username)

        # Verify template rendering
        mock_render.assert_called_once_with(
            'welcome_email.html',
            {
                'username': self.test_username,
                'domain': settings.APP_URL
            }
        )

    @patch('accounts.emails.email_service.SendGridAPIClient')
    def test_email_with_invalid_recipient(self, mock_sendgrid):
        """Test sending email to invalid recipient."""
        invalid_email = "not-an-email"

        # Setup mock to raise an exception for invalid email
        mock_sendgrid.return_value.send.side_effect = KeyError(
            "email"
        )

        # Send email and capture printed output
        with self.assertLogs() as captured:
            status_code = send_welcome_email(invalid_email, self.test_username)

        # Assertions
        self.assertIsNone(status_code)
        self.assertTrue(
            any("Error sending email: Invalid param 'email'" in output
                for output in captured.output)
        )

    @patch('accounts.emails.email_service.SendGridAPIClient')
    def test_email_with_empty_username(self, mock_sendgrid):
        """Test sending email with empty username."""
        empty_username = ""

        # Send email
        with self.assertRaises(ValueError):
            send_welcome_email(self.test_email, empty_username)
