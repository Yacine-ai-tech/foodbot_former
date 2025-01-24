from django.urls import path
from . import views

urlpatterns = [
    path('menu/', views.get_menu, name='get_menu'),  # Endpoint to fetch all menu items
    path('order/', views.place_order, name='place_order'),  # Endpoint to place a new order
]
