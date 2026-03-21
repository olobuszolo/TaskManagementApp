from django.contrib import admin
from .models import Categories, Events, EventParticipants
# Register your models here.
admin.site.register(Categories)
admin.site.register(Events)
admin.site.register(EventParticipants)
