from django.contrib.auth.models import User
from django.db.models import F, Value, Subquery, OuterRef, Q
from django.db.models.functions import Concat
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.utils import json
import datetime

import traceback

from myapp.models import Employee, Company, Substitution


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


# Employees page
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
                employees = list(Employee.objects.filter(user_id=request.user.id).values())
                return JsonResponse({"employees": employees})
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
                    employee = Employee.objects.get(id=employee_id, user=request.user)
                    full_name = employee.full_name
                    employee.delete()
                    return JsonResponse({"action_success": True, 'full_name': full_name})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


class EmployeeEditView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak."}}, status=400)

            employee_id = int(data.get('employeeId'))
            if employee_id:
                first_name = data.get('first_name', None)
                last_name = data.get('last_name', None)
                agreement_type = data.get('agreement_type', None)
                agreement_end_date = datetime.datetime.fromisoformat(data.get('agreement_end_date')).date() if data.get('agreement_end_date') else None
                medical_end_date = datetime.datetime.fromisoformat(data.get('medical_end_date')).date() if data.get('medical_end_date') else None
                building_license_end_date = datetime.datetime.fromisoformat(data.get('building_license_end_date')).date() if data.get('building_license_end_date') else None
                default_build = data.get('default_build', None)
                comments = data.get('comments', None)
                try:
                    employee = Employee.objects.filter(user_id=request.user.id, id=employee_id)
                    employee.update(first_name=first_name, last_name=last_name, agreement_type=agreement_type, agreement_end_date=agreement_end_date, medical_end_date=medical_end_date, building_license_end_date=building_license_end_date, default_build=default_build, comments=comments)
                    return JsonResponse({"action_success": True, "messages": {"success": "Edytowano pracownika: " + first_name + ' ' + last_name}})
                except:
                    return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się edytować pracownika."}},
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
                    employee = list(Employee.objects.filter(user_id=request.user.id, id=employee_id).values())[0]
                    return JsonResponse({'employee': employee})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


# Companies page
class CompaniesView(View):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                companies = list(Company.objects.filter(user_id=request.user.id).values())
                return JsonResponse({"companies": companies})
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się załadować firm."}},
                                status=400)


class CompanyCreateView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            name = data.get('company_name', None)
            comments = data.get('comments', None)
            try:
                new_company = Company(user=request.user, name=name, comments=comments)
                new_company.save()
                return JsonResponse({"action_success": True, "messages": {"success": "Dodano firmę."}})
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się utworzyć firmy"}},
                                status=400)


class CompanyRemoveView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            company_id = int(data.get('companyId'))
            if company_id:
                try:
                    company = Company.objects.get(user_id=request.user.id, id=company_id)
                    name = company.name
                    company.delete()
                    return JsonResponse({"action_success": True, 'name': name})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


class GetCompanyByIdView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            company_id = int(data.get('companyId'))
            if company_id:
                try:
                    company = list(Company.objects.filter(user_id=request.user.id, id=company_id).values())[0]
                    return JsonResponse({'company': company})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


class CompanyEditView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak."}}, status=400)

            company_id = int(data.get('companyId'))
            if company_id:
                name = data.get('company_name', None)
                comments = data.get('comments', None)
                try:
                    company = Company.objects.filter(user_id=request.user.id, id=company_id)
                    company.update(name=name, comments=comments)
                    return JsonResponse({"action_success": True, "messages": {"success": "Edytowano firmę: " + name}})
                except:
                    return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się edytować firmy."}},
                                    status=400)


# Dashboard page
class SubstitutionsView(View):
    history = False

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            try:
                substitutions = list(Substitution.objects.filter(user_id=request.user.id, history=self.history).values())

                for substitution in substitutions:

                    substitution['substituted_full_name'] = (
                        Employee.objects.get(user_id=request.user.id, id=int(substitution['substituted'].split('-')[-1])).full_name if
                        (substitution['substituted'].split('-')[0].startswith("employee") and Employee.objects.filter(user_id=request.user.id, id=int(substitution['substituted'].split('-')[-1])).exists()) else Company.objects.get(
                            user_id=request.user.id, id=int(substitution['substituted'].split('-')[-1])).name if (substitution[
                        'substituted'] and Company.objects.filter(
                            user_id=request.user.id, id=int(substitution['substituted'].split('-')[-1])).exists()) else None)

                    substitution['substituted_by_full_name'] = (
                        Employee.objects.get(user_id=request.user.id, id=int(substitution['substituted_by'].split('-')[-1])).full_name if
                        (substitution['substituted_by'].split('-')[0].startswith("employee") and Employee.objects.filter(user_id=request.user.id, id=int(substitution['substituted_by'].split('-')[-1])).exists()) else Company.objects.get(
                            user_id=request.user.id, id=int(substitution['substituted_by'].split('-')[-1])).name if (substitution[
                        'substituted_by'] and Company.objects.filter(
                            user_id=request.user.id, id=int(substitution['substituted_by'].split('-')[-1])).exists()) else None)

                return JsonResponse({"substitutions": substitutions})
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się załadować zastępstw."}},
                                status=400)


class SubstitutionCreateView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            date = datetime.datetime.fromisoformat(data.get('date')).date() if data.get('date') else None
            substituted = data.get('substituted', None)
            substituted_by = data.get('substituted_by', None)
            action_type = data.get('action_type', None)
            location = data.get('location', None)
            crane = data.get('crane', None)
            duration_hours = int(data.get('duration_hours')) if data.get('duration_hours') else None
            amount = int(data.get('amount')) if data.get('amount') else None
            comments = data.get('comments', None)

            try:
                new_substitution = Substitution(user=request.user, date=date, substituted=substituted, substituted_by=substituted_by, action_type=action_type, location=location, crane=crane, duration_hours=duration_hours, amount=amount, comments=comments)
                new_substitution.save()
                return JsonResponse({"action_success": True, "messages": {"success": "Pomyślnie dodano " + Substitution.ACTION_TYPES[action_type] + "."}})
            except:
                # print(traceback.format_exc())
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się utworzyć: " + Substitution.ACTION_TYPES[action_type] + "."}},
                                status=400)


class SubstitutionToHistory(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            date = data.get('date', None)
            if date is not None:
                try:
                    date_splited = date.split("-")
                    year = date_splited[0]
                    month = date_splited[1]
                    Substitution.objects.filter(user_id=request.user.id, date__year=year, date__month=month).update(history=True)
                    return JsonResponse({"action_success": True, "messages": {"success": "Przeniesiono do historii zastępstwa z okresu: " + date + "."}})
                except:
                    return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się przenieść zastępstw do historii."}},
                                    status=400)


class SubstitutionRemoveView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            substitution_id = int(data.get('substitution_id'))
            if substitution_id:
                try:
                    substitution = Substitution.objects.get(user_id=request.user.id, id=substitution_id)
                    substitution.delete()
                    return JsonResponse({"action_success": True})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)


class GetSubstitutionByIdView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            substitution_id = int(data.get('substitution_id'))
            if substitution_id:
                try:
                    substitution = list(Substitution.objects.filter(user_id=request.user.id, id=substitution_id).values())[0]

                    substitution['substituted_full_name'] = (
                        Employee.objects.get(user_id=request.user.id,
                                             id=int(substitution['substituted'].split('-')[-1])).full_name if
                        (substitution['substituted'].split('-')[0].startswith("employee") and Employee.objects.filter(
                            user_id=request.user.id,
                            id=int(substitution['substituted'].split('-')[-1])).exists()) else Company.objects.get(
                            user_id=request.user.id, id=int(substitution['substituted'].split('-')[-1])).name if (
                                    substitution[
                                        'substituted'] and Company.objects.filter(
                                user_id=request.user.id,
                                id=int(substitution['substituted'].split('-')[-1])).exists()) else None)

                    substitution['substituted_by_full_name'] = (
                        Employee.objects.get(user_id=request.user.id,
                                             id=int(substitution['substituted_by'].split('-')[-1])).full_name if
                        (substitution['substituted_by'].split('-')[0].startswith(
                            "employee") and Employee.objects.filter(user_id=request.user.id, id=int(
                            substitution['substituted_by'].split('-')[-1])).exists()) else Company.objects.get(
                            user_id=request.user.id, id=int(substitution['substituted_by'].split('-')[-1])).name if (
                                    substitution[
                                        'substituted_by'] and Company.objects.filter(
                                user_id=request.user.id,
                                id=int(substitution['substituted_by'].split('-')[-1])).exists()) else None)

                    return JsonResponse({'substitution': substitution})
                except:
                    return JsonResponse({"action_success": False},
                                    status=400)

class SubstitutionEditView(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak."}}, status=400)

            substitution_id = int(data.get('substitution_id'))
            if substitution_id:
                date = datetime.datetime.fromisoformat(data.get('date')).date() if data.get('date') else None
                substituted = data.get('substituted', None)
                substituted_by = data.get('substituted_by', None)
                action_type = data.get('action_type', None)
                location = data.get('location', None)
                crane = data.get('crane', None)
                duration_hours = int(data.get('duration_hours')) if data.get('duration_hours') else None
                amount = int(data.get('amount')) if data.get('amount') else None
                comments = data.get('comments', None)

                try:
                    substitution = Substitution.objects.filter(user_id=request.user.id, id=substitution_id)
                    substitution.update(date=date, substituted=substituted, substituted_by=substituted_by, action_type=action_type, location=location, crane=crane, duration_hours=duration_hours, amount=amount, comments=comments)

                    return JsonResponse({"action_success": True, "messages": {"success": "Pomyślnie edytowano pozycję." }})
                except:
                    return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się edytować pozycji."}},
                                    status=400)


class SubstitutionsToRemoveFromDB(View):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Coś poszło nie tak"}}, status=400)

            date = data.get('date', None)
            if date is not None:
                try:
                    date_splited = date.split("-")
                    year = date_splited[0]
                    month = date_splited[1]
                    Substitution.objects.filter(user_id=request.user.id, date__year=year, date__month=month).delete()
                    return JsonResponse({"action_success": True, "messages": {"success": "Usunięto na zawsze pozycje z: " + date + "."}})
                except:
                    return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się usunąć pozycji z historii."}},
                                    status=400)


class InfoBoxData(View):

    def get(self, request):
        if request.user.is_authenticated:
            try:
                now_date = datetime.datetime.now().date()
                deadline_date = now_date + datetime.timedelta(days=14)
                user_employees = Employee.objects.filter(user_id=request.user.id)
                employees = list(user_employees.filter(
                    Q(agreement_end_date__isnull=False) & Q(agreement_end_date__lte=deadline_date) |
                    Q(medical_end_date__isnull=False) & Q(medical_end_date__lte=deadline_date) |
                    Q(building_license_end_date__isnull=False) & Q(building_license_end_date__lte=deadline_date)
                    ).annotate(full_name=Concat('first_name', Value(' '), 'last_name')).values())
                agreement_end_date_list, medical_end_date_list, building_license_end_date_list = [], [], []

                for employee in employees:
                    empl_agreement_end_date = employee['agreement_end_date']
                    empl_medical_end_date = employee['medical_end_date']
                    empl_building_license_end_date = employee['building_license_end_date']

                    if empl_agreement_end_date is not None and empl_agreement_end_date <= deadline_date:
                        delta = (empl_agreement_end_date - now_date).days if empl_agreement_end_date > now_date else 0
                        agreement_end_date_list.append({'name': employee['full_name'], 'date': empl_agreement_end_date, 'delta': delta})

                    if empl_medical_end_date is not None and empl_medical_end_date <= deadline_date:
                        delta = (empl_medical_end_date - now_date).days if empl_medical_end_date > now_date else 0
                        medical_end_date_list.append({'name': employee['full_name'], 'date': empl_medical_end_date, 'delta': delta})

                    if empl_building_license_end_date is not None and empl_building_license_end_date <= deadline_date:
                        delta = (empl_building_license_end_date - now_date).days if empl_building_license_end_date > now_date else 0
                        building_license_end_date_list.append({'name': employee['full_name'], 'date': empl_building_license_end_date, 'delta': delta})

                return JsonResponse({"info_box_data": {'building_license_end_date': building_license_end_date_list, 'medical_end_date': medical_end_date_list, 'agreement_end_date': agreement_end_date_list}})
            except:
                return JsonResponse({"action_success": False, "messages": {"errors": "Nie udało się załadować danych o terminach umów/badań/uprawnień pracowników."}},
                                status=400)


# Other
class EmployeesSelectView(View):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                employees = list(Employee.objects.filter(user_id=request.user.id).values('id', 'first_name', 'last_name'))
                return JsonResponse({"employees": employees})
            except:
                # print(traceback.format_exc())
                return JsonResponse(
                    {"action_success": False, "messages": {"errors": "Nie udało się załadować listy Pracowników."}},
                    status=400)


class CompaniesSelectView(View):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                companies = list(Company.objects.filter(user_id=request.user.id).values('id', 'name'))
                return JsonResponse({"companies": companies})
            except:
                # print(traceback.format_exc())
                return JsonResponse(
                    {"action_success": False, "messages": {"errors": "Nie udało się załadować listy Firm."}},
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

@api_view(['GET'])
def get_action_types(request):
    if request.user.is_authenticated:
        action_types = Substitution.ACTION_TYPES
        return JsonResponse({"action_types": action_types})
