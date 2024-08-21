# Generated by Django 4.1.3 on 2024-08-19 17:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fftracker', '0021_imageupload'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipes',
            name='r_card_upload',
            field=models.ForeignKey(blank=True, db_column='r_card_upload', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='r_card', to='fftracker.imageupload'),
        ),
        migrations.AddField(
            model_name='recipes',
            name='r_img_upload',
            field=models.ForeignKey(blank=True, db_column='r_img_upload', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='r_image', to='fftracker.imageupload'),
        ),
        migrations.AlterField(
            model_name='imageupload',
            name='file',
            field=models.FileField(upload_to=''),
        ),
    ]