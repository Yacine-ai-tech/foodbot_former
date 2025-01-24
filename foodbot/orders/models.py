from django.db import models

class Menu(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    user_id = models.IntegerField()
    menu_item = models.ForeignKey(Menu, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    status = models.CharField(max_length=255)
    order_date = models.DateTimeField(auto_now_add=True)
