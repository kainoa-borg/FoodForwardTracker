# Generated by Django 4.1.3 on 2024-03-28 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fftracker', '0018_alter_ingredientunits_recipe_amt_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='households',
            name='hh_bags_or_crates',
            field=models.TextField(blank=True, null=True),
        ),
    ]
