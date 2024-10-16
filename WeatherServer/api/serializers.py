from rest_framework import serializers


class WeatherSerializer(serializers.Serializer):
    city = serializers.CharField(max_length=100)
    start_date = serializers.IntegerField()
    end_date = serializers.IntegerField()
