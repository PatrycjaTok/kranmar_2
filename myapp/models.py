from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey


class Employee(models.Model):
    objects = models.Manager()

    AGREEMENT_TYPES = {
        'B2B': 'B2B',
        'ZL': 'Zlecenie',
        '1': 'Pełny etat',
        '12': '1/2 etatu',
        '34': '3/4 etatu'
    }

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    agreement_type = models.CharField(max_length=30, choices=AGREEMENT_TYPES)
    agreement_end_date = models.DateField(null=True)
    medical_end_date = models.DateField(null=True)
    building_license_end_date = models.DateField(null=True)
    default_build = models.CharField(max_length=40)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    comments = models.CharField(max_length=200)

    class Meta:
        ordering = ["last_name"]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Company(models.Model):
    objects = models.Manager()

    name = models.CharField(max_length=60)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    comments = models.CharField(max_length=200)

    class Meta:
        ordering = ["name"]


class Substitution(models.Model):
    objects = models.Manager()

    ACTION_TYPES = {
        'zn': 'Z_nasze',
        'zi': 'Z_inne',
        'z': 'Zaliczka',
        'w': 'Wolne',
    }

    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    history = models.BooleanField(default=False)
    date = models.DateField(null=True)
    substituted = models.CharField(max_length=15)
    substituted_by = models.CharField(max_length=15)
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)
    location = models.CharField(max_length=30)
    crane = models.CharField(max_length=30)
    duration_hours = models.IntegerField()
    amount = models.IntegerField()
    comments = models.CharField(max_length=200)
    class Meta:
        ordering = ["date"]

    # @property
    # def full_name(self):
    #     return f"{self.first_name} {self.last_name}"
