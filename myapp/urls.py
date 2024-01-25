from django.urls import path
from . import views

urlpatterns = [
    path('session/', views.session_view, name='api_session'),
    path('whoami/', views.whoami_view, name='api_whoami'),
    path('login/', views.LoginView.as_view(), name='login_req'),
    path('registry/', views.RegistryView.as_view(), name='registry_req'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password_req'),
    path('logout/', views.LogoutUser.as_view()),
]
