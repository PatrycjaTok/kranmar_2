from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey


class Employee(models.Model):

    AGREEMENT_TYPES = {
        'B2B': 'B2B',
        'ZL': 'Zlecenie',
        '1': 'Pełny etat',
        '1/2': '1/2 etatu',
        '3/4': '3/4 etatu'
    }

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    agreement_type = models.CharField(max_length=30, choices=AGREEMENT_TYPES)
    agreement_end_date = models.DateField()
    medical_end_date = models.DateField()
    building_license_end_date = models.DateField()
    default_build = models.CharField(max_length=40)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    comments = models.CharField(max_length=200)

    class Meta:
        ordering = ["-last_name"]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
