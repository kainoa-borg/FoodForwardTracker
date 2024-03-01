# Generated by Django 4.1.3 on 2023-11-14 19:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fftracker', '0011_packagingtypes_packagingtypesizes'),
    ]

    operations = [
        migrations.AddField(
            model_name='packagingtypesizes',
            name='pkg_type_fk',
            field=models.ForeignKey(db_column='pkg_type_fk', default=1, on_delete=django.db.models.deletion.CASCADE, related_name='pkg_sizes', to='fftracker.packagingtypes'),
            preserve_default=False,
        ),
    ]