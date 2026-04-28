from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_status_remove_events_status_events_status_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='categories',
            name='color',
            field=models.CharField(default='#2563eb', max_length=7),
        ),
    ]
