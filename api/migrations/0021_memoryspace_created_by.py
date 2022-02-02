# Generated by Django 4.0.1 on 2022-02-02 09:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_alter_image_options_image_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='memoryspace',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]