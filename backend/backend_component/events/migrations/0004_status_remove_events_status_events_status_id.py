import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_alter_events_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('color', models.CharField(blank=True, default='#000000', max_length=7, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='events',
            name='status',
        ),
        migrations.AddField(
            model_name='events',
            name='status_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='events', to='events.status'),
        ),
    ]
