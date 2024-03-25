from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from myapp.models import UserConfig


@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserConfig.objects.create(user=instance)

