from django.urls import path
from . import views

urlpatterns = [
    path("rain/", views.PredictRain.as_view(), name="predict-rain"),
    path(
        "temperature/", views.PredictTemperature.as_view(), name="predict-temperature"
    ),
]
