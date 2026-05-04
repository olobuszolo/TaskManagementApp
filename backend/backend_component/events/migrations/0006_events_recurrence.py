from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_categories_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='is_recurring',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='events',
            name='recurrence_end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='events',
            name='recurrence_frequency',
            field=models.CharField(
                blank=True,
                choices=[
                    ('daily', 'Every day'),
                    ('weekly', 'Every week'),
                    ('monthly', 'Every month'),
                    ('yearly', 'Every year'),
                ],
                max_length=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='events',
            name='recurrence_interval',
            field=models.PositiveIntegerField(default=1),
        ),
    ]
