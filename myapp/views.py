from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views import View
from django.views.generic import TemplateView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from rest_framework.utils import json


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, hello, hello world!'})


class LoginView(View):

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if username is None or password is None:
            return JsonResponse({"action_success": False, "messages": {"errors": "Uzupełnij dane."}}, status=400)
        if user is None:
            return JsonResponse({"action_success": False, "messages": {"errors": "Niepoprawne dane."}}, status=400)

        login(request, user)
        return JsonResponse({"action_success": True, "messages": {"success": "Succesfull logged."}})


class RegistryView(View):

    def post(self, request):
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)
        username = data.get('login')
        password = data.get('password1')
        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return JsonResponse({"action_success": False, "messages": {"errors": "Niektóre dane istnieją już w bazie. Wprowadź inne dane."}}, status=400)
        else:
            user = User.objects.create_user(username=username, password=password, first_name=name, last_name=surname, email=email)
            user.save()
            return JsonResponse({"action_success": True, "messages": {"success": "Konto zostało utworzone."}})


class ResetPasswordView(View):

    def post(self, request):
        req = request.POST
        # TODO: RESET PASSWORD
        pass


class LogoutUser(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"action_success": False, "messages": {"errors": "Nie jesteś zalogowany!"}}, status=400)
        logout(request)
        return JsonResponse({"action_success": True, "messages": {"success": "Zostałeś wylogowany!"}})


@ensure_csrf_cookie
@api_view(['GET'])
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"username": request.user.username})


class HomePageView(TemplateView):
    template_name = 'users/welcome_pages/welcome_user.html'
    # model = Project

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)
        # context = super(VisualizationView, self).get_context_data(**kwargs)
        # context['projects'] = Project.objects.all()

        return context