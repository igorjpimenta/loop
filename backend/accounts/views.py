from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .permissions import IsOwnerOrReadOnly
from rest_framework import views, viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserLoginSerializer
from .emails.email_service import send_welcome_email


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsOwnerOrReadOnly]


class UserRegistrationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    @method_decorator(ensure_csrf_cookie)
    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            send_welcome_email(user.email, user.username)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)

            user_data = UserSerializer(user).data

            return Response(user_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(views.APIView):
    def post(self, request):
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)
