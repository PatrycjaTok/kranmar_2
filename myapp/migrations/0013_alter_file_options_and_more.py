# Generated by Django 5.0.1 on 2024-03-27 12:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0012_userconfig'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='file',
            options={},
        ),
        migrations.AlterField(
            model_name='userconfig',
            name='messages_animation',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='userconfig',
            name='messages_show',
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name='PasswordToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_date', models.DateField(null=True)),
                ('expire_date', models.DateField(null=True)),
                ('token', models.CharField(max_length=30)),
                ('used_attempts', models.IntegerField(default=3, null=True)),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
