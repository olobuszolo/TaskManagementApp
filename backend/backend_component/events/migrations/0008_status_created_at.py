from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0007_recurringevents_recurrence_series'),
    ]

    operations = [
        migrations.AddField(
            model_name='status',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=timezone.now),
            preserve_default=False,
        ),
    ]
