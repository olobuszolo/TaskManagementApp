from django.contrib.auth.models import User
from rest_framework import status as http_status
from rest_framework.test import APITestCase

from .models import Categories, Events, EventParticipants, RecurringEvents


class EventsApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="event-owner",
            email="owner@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=self.user)

    # Verifies that creating a recurring event creates separate rows for each occurrence.
    def test_creating_recurring_event_creates_independent_event_rows(self):
        # Arrange
        payload = {
            "title": "Training",
            "description": "Initial description",
            "scheduled_for": "2026-04-24T09:00:00Z",
            "category_id": None,
            "status_id": None,
            "is_recurring": True,
            "recurrence_frequency": "daily",
            "recurrence_interval": 2,
            "recurrence_end_date": "2026-04-29",
        }

        # Act
        response = self.client.post(
            "/events/",
            payload,
            format="json",
        )

        # Assert
        self.assertEqual(response.status_code, http_status.HTTP_201_CREATED)
        self.assertEqual(RecurringEvents.objects.count(), 1)
        self.assertEqual(Events.objects.count(), 3)
        self.assertEqual(EventParticipants.objects.filter(user_id=self.user).count(), 3)

        event_dates = list(
            Events.objects.order_by("scheduled_for").values_list("scheduled_for", flat=True)
        )
        self.assertEqual(
            [event.date().isoformat() for event in event_dates],
            ["2026-04-24", "2026-04-26", "2026-04-28"],
        )
        self.assertEqual(
            Events.objects.values("recurrence_series_id").distinct().count(),
            1,
        )

    # Verifies that deleting one recurring event occurrence deletes the whole series.
    def test_deleting_one_occurrence_deletes_whole_recurring_series(self):
        # Arrange
        self.client.post(
            "/events/",
            {
                "title": "Standup",
                "description": "Daily check-in",
                "scheduled_for": "2026-04-24T12:00:00Z",
                "category_id": None,
                "status_id": None,
                "is_recurring": True,
                "recurrence_frequency": "daily",
                "recurrence_interval": 1,
                "recurrence_end_date": "2026-04-26",
            },
            format="json",
        )
        event_to_delete = Events.objects.order_by("scheduled_for")[1]

        # Act
        response = self.client.delete(f"/events/{event_to_delete.id}/")

        # Assert
        self.assertEqual(response.status_code, http_status.HTTP_204_NO_CONTENT)
        self.assertEqual(Events.objects.count(), 0)
        self.assertEqual(RecurringEvents.objects.count(), 0)
        self.assertEqual(EventParticipants.objects.count(), 0)


class CategoriesApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="category-owner",
            email="category@example.com",
            password="password123",
        )
        self.other_user = User.objects.create_user(
            username="other-owner",
            email="other@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=self.user)

    # Verifies that the category list returns only the current user's categories.
    def test_category_list_returns_only_current_user_categories(self):
        # Arrange
        own_category = Categories.objects.create(owner_id=self.user, name="Work", color="#2563eb")
        Categories.objects.create(owner_id=self.other_user, name="Private", color="#dc2626")

        # Act
        response = self.client.get("/events/categories/")

        # Assert
        self.assertEqual(response.status_code, http_status.HTTP_200_OK)
        self.assertEqual([category["id"] for category in response.data], [own_category.id])

    # Verifies that creating a category automatically assigns it to the current user.
    def test_creating_category_assigns_current_user_as_owner(self):
        # Arrange
        payload = {
            "name": "Studies",
            "color": "#16a34a",
        }

        # Act
        response = self.client.post("/events/categories/", payload, format="json")

        # Assert
        self.assertEqual(response.status_code, http_status.HTTP_201_CREATED)
        category = Categories.objects.get(name="Studies")
        self.assertEqual(category.owner_id, self.user)
        self.assertEqual(category.color, "#16a34a")


class StatusesApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="status-user",
            email="status@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=self.user)

    # Verifies that the statuses endpoint returns the available event statuses.
    def test_status_list_returns_available_statuses(self):
        # Arrange
        expected_status_names = ["Not Applicable", "To Do", "In Progress", "Done"]

        # Act
        response = self.client.get("/events/statuses/")

        # Assert
        self.assertEqual(response.status_code, http_status.HTTP_200_OK)
        self.assertEqual(
            [item["name"] for item in response.data],
            expected_status_names,
        )
