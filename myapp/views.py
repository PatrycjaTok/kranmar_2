from django.contrib.auth.models import User
from django.db.models import F, Value
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.utils import json
import datetime

import traceback

from myapp.models import Employee


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


class LogoutUserView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"action_success": False, "messages": {"errors": "Nie jesteś zalogowany!"}}, status=400)
        logout(request)
        return JsonResponse({"action_success": True, "messages": {"success": "Zostałeś wylogowany!"}})


class EmployeeCreateView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            first_name = data.get('first_name', None)
            last_name = data.get('last_name', None)
            agreement_type = data.get('agreement_type', None)
            agreement_end_date = datetime.datetime.fromisoformat(data.get('agreement_end_date')).date() if data.get('agreement_end_date') else None
            medical_end_date = datetime.datetime.fromisoformat(data.get('medical_end_date')).date() if data.get('medical_end_date') else None
            building_license_end_date = datetime.datetime.fromisoformat(data.get('building_license_end_date')).date() if data.get('building_license_end_date') else None
            default_build = data.get('default_build', None)
            comments = data.get('comments', None)
            try:
                new_employer = Employee(user=request.user, first_name=first_name, last_name=last_name, agreement_type=agreement_type, agreement_end_date=agreement_end_date, medical_end_date=medical_end_date, building_license_end_date=building_license_end_date, default_build=default_build, comments=comments)
                new_employer.save()
                return JsonResponse({"action_success": True, "messages": {"success": "Dodano pracownika."}})
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się utworzyć pracownika"}},
                                status=400)


class EmployeesView(View):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                employees = Employee.objects.filter(user_id=request.user.id)
                employees_list = list(employees.values())
                result = employees_list
                return JsonResponse({"employees": result})
            except:
                # print(traceback.format_exc())
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się załadować pracowników."}},
                                status=400)


class EmployeeRemoveView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            employee_id = int(data.get('employeeId'))
            if employee_id:
                try:
                    employee = Employee.objects.get(id=employee_id)
                    full_name = employee.full_name
                    employee.delete()
                    return JsonResponse({"action_success": True, 'full_name': full_name})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


class GetEmployeeByIdView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            employee_id = int(data.get('employeeId'))
            if employee_id:
                try:
                    employee = list(Employee.objects.filter(id=employee_id).values())[0]
                    return JsonResponse({'employee': employee})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


@api_view(['GET'])
def get_agreements_types(request):
    if request.user.is_authenticated:
        agreements_types = Employee.AGREEMENT_TYPES
        return JsonResponse({"agreements_types": agreements_types})


@ensure_csrf_cookie
@api_view(['GET'])
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({
        "user_id": request.user.id,
        "username": request.user.username,
    })
