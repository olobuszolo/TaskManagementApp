from .serializers import CategorySerializer, EventSerializer, EventParticipantSerializer, StatusSerializer
from rest_framework import generics
from .models import Categories, Events, EventParticipants, RecurringEvents, Status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.db import transaction
from datetime import datetime, timedelta
import calendar


def get_month_bounds(year, month):
    month_start = datetime(year, month, 1).date()
    if month == 12:
        next_month_start = datetime(year + 1, 1, 1).date()
    else:
        next_month_start = datetime(year, month + 1, 1).date()

    return month_start, next_month_start


def add_months(value, months):
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    day = min(value.day, calendar.monthrange(year, month)[1])

    return value.replace(year=year, month=month, day=day)


def add_years(value, years):
    try:
        return value.replace(year=value.year + years)
    except ValueError:
        return value.replace(year=value.year + years, month=2, day=28)


def add_recurrence_interval(value, frequency, interval):
    if frequency == RecurringEvents.RecurrenceFrequency.DAILY:
        return value + timedelta(days=interval)
    if frequency == RecurringEvents.RecurrenceFrequency.WEEKLY:
        return value + timedelta(weeks=interval)
    if frequency == RecurringEvents.RecurrenceFrequency.MONTHLY:
        return add_months(value, interval)
    if frequency == RecurringEvents.RecurrenceFrequency.YEARLY:
        return add_years(value, interval)

    return value


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return Categories.objects.filter(owner_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)

class CategoryDetailView(generics.RetrieveUpdateAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Categories.objects.filter(owner_id=self.request.user)

class StatusListView(generics.ListAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_visible_month(self):
        today = timezone.localdate()
        year_param = self.request.query_params.get("year")
        month_param = self.request.query_params.get("month")

        try:
            year = int(year_param) if year_param is not None else today.year
            month = int(month_param) if month_param is not None else today.month
        except (TypeError, ValueError):
            raise ValidationError("Query params 'year' and 'month' must be integers.")

        if month < 1 or month > 12:
            raise ValidationError("Query param 'month' must be between 1 and 12.")

        return year, month

    def get_queryset(self):
        user = self.request.user
        year, month = self.get_visible_month()
        month_start, next_month_start = get_month_bounds(year, month)

        return (
            Events.objects
            .filter(
                participants__user_id=user,
            )
            .filter(
                scheduled_for__date__gte=month_start,
                scheduled_for__date__lt=next_month_start,
            )
            .distinct()
            .order_by("scheduled_for")
        )
    
    @transaction.atomic
    def perform_create(self, serializer):
        event = serializer.save(creator_id=self.request.user)
        EventParticipants.objects.create(event_id=event, user_id=self.request.user)

        if not event.is_recurring:
            return

        recurrence_series = RecurringEvents.objects.create(
            creator_id=self.request.user,
            frequency=event.recurrence_frequency,
            interval=event.recurrence_interval,
            end_date=event.recurrence_end_date,
        )
        event.recurrence_series_id = recurrence_series
        event.save(update_fields=['recurrence_series_id'])

        occurrence = add_recurrence_interval(
            event.scheduled_for,
            recurrence_series.frequency,
            recurrence_series.interval,
        )
        while occurrence.date() <= recurrence_series.end_date:
            next_event = Events.objects.create(
                title=event.title,
                description=event.description,
                scheduled_for=occurrence,
                creator_id=self.request.user,
                category_id=event.category_id,
                status_id=event.status_id,
                group_id=event.group_id,
                recurrence_series_id=recurrence_series,
                is_recurring=True,
                recurrence_frequency=recurrence_series.frequency,
                recurrence_interval=recurrence_series.interval,
                recurrence_end_date=recurrence_series.end_date,
            )
            EventParticipants.objects.create(event_id=next_event, user_id=self.request.user)

            next_occurrence = add_recurrence_interval(
                occurrence,
                recurrence_series.frequency,
                recurrence_series.interval,
            )
            if next_occurrence <= occurrence:
                break
            occurrence = next_occurrence


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Events.objects.filter(participants__user_id=user)
    
    @transaction.atomic
    def perform_destroy(self, instance):
        recurrence_series = instance.recurrence_series_id

        if recurrence_series:
            Events.objects.filter(recurrence_series_id=recurrence_series).delete()
            recurrence_series.delete()
            return

        EventParticipants.objects.filter(event_id=instance).delete()
        instance.delete()
    

class EventParticipantListCreateView(generics.ListCreateAPIView):
    queryset = EventParticipants.objects.all()
    serializer_class = EventParticipantSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return EventParticipants.objects.filter(user_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)
