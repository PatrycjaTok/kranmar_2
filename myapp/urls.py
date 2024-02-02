from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json'), name='manifest.json'),
    path('session/', views.session_view, name='api_session'),
    path('whoami/', views.whoami_view, name='api_whoami'),
    path('login/', views.LoginView.as_view(), name='login_req'),
    path('registry/', views.RegistryView.as_view(), name='registry_req'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password_req'),
    path('logout/', views.LogoutUserView.as_view()),
]
