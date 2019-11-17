from django.shortcuts import render, redirect  # noqa
from django.contrib.auth import authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_401_UNAUTHORIZED
)
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required



@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_401_UNAUTHORIZED)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'nome': user.nome, 'email': user.email},
                    status=HTTP_200_OK)

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def verify_token(request):
    token_data = request.data.get("token")
    if token_data is None :
        return Response({'error': 'Please provide token'},
                        status=HTTP_400_BAD_REQUEST)
  
    token = Token.objects.get(key=token_data)
    if token is None :
        return Response({'error': 'Token error'},
                        status=HTTP_400_BAD_REQUEST)

    return Response({'token': token.key, 'nome': token.user.nome, 'email': token.user.email},
                    status=HTTP_200_OK)


def logout_view(request):
    logout(request)
    return redirect('/')