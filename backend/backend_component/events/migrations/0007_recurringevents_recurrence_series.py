import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0006_events_recurrence'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecurringEvents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frequency', models.CharField(
                    choices=[
                        ('daily', 'Every day'),
                        ('weekly', 'Every week'),
                        ('monthly', 'Every month'),
                        ('yearly', 'Every year'),
                    ],
                    max_length=10,
                )),
                ('interval', models.PositiveIntegerField(default=1)),
                ('end_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('creator_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='recurring_events',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
        ),
        migrations.AddField(
            model_name='events',
            name='recurrence_series_id',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='events',
                to='events.recurringevents',
            ),
        ),
    ]
