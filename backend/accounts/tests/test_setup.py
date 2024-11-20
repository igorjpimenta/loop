from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
import abc

User = get_user_model()


class BaseTestSetup(abc.ABC):
    """Base test setup for accounts app."""

    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!'
        }


class TestSetup(BaseTestSetup, TestCase):
    """Test setup for accounts app tests."""


class APITestSetup(BaseTestSetup, APITestCase):
    """Test setup for accounts app API tests."""

    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.register_url = reverse('user-register-list')
        self.login_url = reverse('user-login')
        self.logout_url = reverse('user-logout')


class TransactionTestSetup(BaseTestSetup, TransactionTestCase):
    """Test setup for accounts app transaction tests."""
