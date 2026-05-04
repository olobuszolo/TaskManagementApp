from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_alter_events_description_alter_events_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='status',
            field=models.CharField(max_length=20),
        ),
    ]
