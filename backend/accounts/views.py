from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import views, viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from .permissions import IsSelfOrReadOnly
from .models import User
from .serializers import UserSerializer, UserLoginSerializer
from .emails.email_service import send_welcome_email


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing User objects.
    Provides CRUD operations with owner-based permissions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsSelfOrReadOnly]


class UserRegistrationViewSet(viewsets.ViewSet):
    """
    ViewSet for user registration.
    Handles user creation, login, and welcome email sending.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    @method_decorator(ensure_csrf_cookie)
    def create(self, request: Request) -> Response:
        """
        Create a new user, log them in, and send welcome email.

        Args:
            request: Request object containing user data

        Returns:
            Response: Created user data or validation errors
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            send_welcome_email(user.email, user.username)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(views.APIView):
    """
    View for handling user login.
    Validates credentials and creates a session.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request: Request) -> Response:
        """
        Authenticate user and create session.

        Args:
            request: Request object containing login credentials

        Returns:
            Response: User data on success or validation errors
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)

            user_data = UserSerializer(user).data

            return Response(user_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(views.APIView):
    """View for handling user logout."""

    def post(self, request: Request) -> Response:
        """
        End user session.

        Args:
            request: Request object

        Returns:
            Response: Empty response with 204 status
        """
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)
