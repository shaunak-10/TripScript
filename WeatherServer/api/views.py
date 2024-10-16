from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import WeatherSerializer
import os
import pickle as pkl
import numpy as np
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings


# Create your views here.
class PredictRain(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        model_dir = os.path.join(
            settings.BASE_DIR,
            "api",
            "assets",
            "rainPred",
            "models",
            "WindSpeedPredictor.pkl",
        )
        with open(model_dir, "rb") as model_file:
            self.model = pkl.load(model_file)

    def predict_rainfall(self, start: int, end: int) -> list:
        rainfall = []
        for i in range(start, end + 1):
            day = np.array(i % 7495).reshape(1, -1)
            rainfall.append(float(self.model.predict(day)[0]))
        return rainfall

    def post(self, request):
        serializer = WeatherSerializer(data=request.data)

        if serializer.is_valid():
            city = serializer.validated_data.get("city")  # type: ignore
            start_date = serializer.validated_data.get("start_date")  # type: ignore
            end_date = serializer.validated_data.get("end_date")  # type: ignore

            rainfall = self.predict_rainfall(start_date, end_date)  # type: ignore

            response_data = {"city": city, "rainfall": rainfall}

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PredictTemperature(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        base_dir = os.path.join(settings.BASE_DIR, "api", "assets")
        temp_dir = os.path.join(base_dir, "tempPred")
        models_dir = os.path.join(temp_dir, "models")
        scalers_dir = os.path.join(temp_dir, "scalers")

        def load_pickle(directory, filename):
            return pkl.load(open(os.path.join(directory, f"{filename}.pkl"), "rb"))

        self.dateScaler = load_pickle(scalers_dir, "DateScaler")

        self.predictors = {}
        self.scalers = {}

        for item in ["DayLight", "SunShine", "MinTemp", "MaxTemp"]:
            self.predictors[item] = load_pickle(models_dir, f"{item}Predictor")
            self.scalers[item] = load_pickle(scalers_dir, f"{item}Scaler")

    def get_day_light_duration(self, date_offset: int):
        date = self.dateScaler.transform(np.array(date_offset).reshape(-1, 1))
        raw_daylight = self.predictors["DayLight"].predict(date).reshape(-1, 1)
        daylight = self.scalers["DayLight"].inverse_transform(raw_daylight)
        return daylight

    def get_sunshine_duration(self, date_offset: int):
        date = self.dateScaler.transform(np.array(date_offset).reshape(-1, 1))
        raw_sunshine = self.predictors["SunShine"].predict(date).reshape(-1, 1)
        sunshine = self.scalers["SunShine"].inverse_transform(raw_sunshine)
        return sunshine

    def get_min_temp(self, date_offset, daylight, sunshine):
        date = self.dateScaler.transform(np.array(date_offset).reshape(-1, 1))
        daylight = self.scalers["DayLight"].transform(np.array(daylight).reshape(-1, 1))
        sunshine = self.scalers["SunShine"].transform(np.array(sunshine).reshape(-1, 1))
        data = np.hstack((date, daylight, sunshine))

        preds = self.predictors["MinTemp"].predict(data).reshape(-1, 1)
        dummy = np.zeros_like(preds)
        preds_with_dummy = np.hstack((dummy, dummy, preds))
        min_temp = self.scalers["MinTemp"].inverse_transform(preds_with_dummy)

        return min_temp[0][-1]

    def get_max_temp(self, date_offset, daylight, sunshine):
        date = self.dateScaler.transform(np.array(date_offset).reshape(-1, 1))
        daylight = self.scalers["DayLight"].transform(np.array(daylight).reshape(-1, 1))
        sunshine = self.scalers["SunShine"].transform(np.array(sunshine).reshape(-1, 1))
        data = np.hstack((date, daylight, sunshine))

        preds = self.predictors["MaxTemp"].predict(data).reshape(-1, 1)
        dummy = np.zeros_like(preds)
        preds_with_dummy = np.hstack((dummy, dummy, preds))
        max_temp = self.scalers["MaxTemp"].inverse_transform(preds_with_dummy)

        return max_temp[0][-1]

    def predict_temperature(self, start: int, end: int) -> list:
        temperature = []
        for i in range(start, end + 1):
            daylight = self.get_day_light_duration(i)
            sunshine = self.get_sunshine_duration(i)
            min_temp = self.get_min_temp(i, daylight, sunshine)
            max_temp = self.get_max_temp(i, daylight, sunshine)
            temperature.append((np.round(min_temp), np.round(max_temp)))
        return temperature

    def predict_daylight(self, start: int, end: int) -> list:
        dayLight = []
        for i in range(start, end + 1):
            daylight = self.get_day_light_duration(i)[0][0]
            dayLight.append(np.round(daylight))
        return dayLight

    def predict_sunshine(self, start: int, end: int) -> list:
        sunShine = []
        for i in range(start, end + 1):
            sunshine = self.get_sunshine_duration(i)[0][0]
            sunShine.append(np.round(sunshine))
        return sunShine

    # @api_view(["POST"])
    def post(self, request):
        serializer = WeatherSerializer(data=request.data)

        if serializer.is_valid():
            city = serializer.validated_data.get("city")  # type: ignore
            start_date = serializer.validated_data.get("start_date")  # type: ignore
            end_date = serializer.validated_data.get("end_date")  # type: ignore

            temperature = self.predict_temperature(start_date, end_date)  # type: ignore
            sunshine = self.predict_sunshine(start_date, end_date)  # type: ignore
            daylight = self.predict_daylight(start_date, end_date)  # type: ignore

            response_data = {
                "city": city,
                "temperature": temperature,
                "sunshine": sunshine,
                "daylight": daylight,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
