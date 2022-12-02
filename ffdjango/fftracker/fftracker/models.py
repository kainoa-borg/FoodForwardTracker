# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Contacts(models.Model):
    c_id = models.IntegerField(primary_key=True)
    first = models.CharField(max_length=50, blank=True, null=True)
    last = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    c_supplier = models.ForeignKey('Supplier', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'contacts'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class HhAllergies(models.Model):
    hh_a_id = models.SmallAutoField(primary_key=True)
    a_type = models.CharField(max_length=30, blank=True, null=True)
    a_code = models.IntegerField(blank=True, null=True)
    a_hh_name = models.ForeignKey('Households', models.DO_NOTHING, related_name='hh_allergies', db_column='a_hh_name')

    class Meta:
        managed = False
        db_table = 'hh_allergies'


class HhKits(models.Model):
    hk_id = models.SmallIntegerField(primary_key=True)
    hk_kit = models.ForeignKey('Kits', models.DO_NOTHING, blank=True, null=True)
    hk_hh_name = models.ForeignKey('Households', models.DO_NOTHING, db_column='hk_hh_name', related_name='hh_kit', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hh_kits'


class HhMealPlans(models.Model):
    hh_m_id = models.SmallIntegerField(primary_key=True)
    meal = models.ForeignKey('MealPlans', models.DO_NOTHING)
    meal_hh_name = models.ForeignKey('Households', models.DO_NOTHING, related_name='hh_meal', db_column='meal_hh_name')

    class Meta:
        managed = False
        db_table = 'hh_meal_plans'


class Households(models.Model):
    hh_name = models.CharField(primary_key=True, max_length=30)
    num_adult = models.PositiveIntegerField(blank=True, null=True)
    num_child = models.PositiveIntegerField(blank=True, null=True)
    sms_flag = models.PositiveIntegerField(blank=True, null=True)
    veg_flag = models.PositiveIntegerField(blank=True, null=True)
    allergy_flag = models.PositiveIntegerField(blank=True, null=True)
    gf_flag = models.PositiveIntegerField(blank=True, null=True)
    ls_flag = models.PositiveIntegerField(blank=True, null=True)
    paused_flag = models.PositiveIntegerField(blank=True, null=True)
    phone = models.CharField(max_length=10, blank=True, null=True)
    street = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pcode = models.PositiveIntegerField(blank=True, null=True)
    state = models.CharField(max_length=2, blank=True, null=True)
    delivery_notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'households'


class IngredientUsages(models.Model):
    i_usage_id = models.SmallIntegerField(primary_key=True)
    used_date = models.CharField(max_length=45)
    used_qty = models.CharField(max_length=45)
    used_ing = models.ForeignKey('Ingredients', models.DO_NOTHING, related_name='ingredient_usage')

    class Meta:
        managed = False
        db_table = 'ingredient_usages'


class Ingredients(models.Model):
    i_id = models.SmallIntegerField(primary_key=True)
    ingredient_name = models.CharField(max_length=50)
    pkg_type = models.CharField(max_length=50)
    storage_type = models.CharField(max_length=50)
    in_date = models.DateField(blank=True, null=True)
    in_qty = models.PositiveSmallIntegerField(blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    exp_date = models.DateField(blank=True, null=True)
    qty_on_hand = models.SmallIntegerField(blank=True, null=True)
    unit_cost = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    flat_fee = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    isupplier = models.ForeignKey('Supplier', models.DO_NOTHING, related_name='isupplier', blank=True, null=True)
    pref_isupplier = models.ForeignKey('Supplier', models.DO_NOTHING, related_name='pref_isupplier', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredients'


class KitPackaging(models.Model):
    kp_ip = models.IntegerField(primary_key=True)
    pkg_type = models.CharField(max_length=50)
    qty = models.SmallIntegerField()
    kp_kit = models.ForeignKey('Kits', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'kit_packaging'


class Kits(models.Model):
    k_id = models.SmallIntegerField(primary_key=True)
    k_date = models.DateField()
    k_hh_name = models.ForeignKey(Households, models.DO_NOTHING, db_column='k_hh_name')

    class Meta:
        managed = False
        db_table = 'kits'


class MealPacks(models.Model):
    mp_id = models.IntegerField(primary_key=True)
    mp_date = models.DateField()
    mp_hh_name = models.ForeignKey(Households, models.DO_NOTHING, db_column='mp_hh_name')
    mp_stn_name = models.ForeignKey('Stations', models.DO_NOTHING, db_column='mp_stn_name')
    mp_kit = models.ForeignKey(Kits, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'meal_packs'


class MealPlans(models.Model):
    m_id = models.SmallIntegerField(primary_key=True)
    m_date = models.CharField(max_length=50)
    snack_r_num = models.ForeignKey('Recipes', models.DO_NOTHING, related_name='mp_snack', db_column='snack_r_num', blank=True, null=True)
    meal_r_num = models.ForeignKey('Recipes', models.DO_NOTHING, related_name='mp_meal', db_column='meal_r_num', blank=True, null=True)
    num_servings = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'meal_plans'


class Packaging(models.Model):
    p_id = models.SmallIntegerField(primary_key=True)
    package_type = models.CharField(max_length=50)
    unit_qty = models.SmallIntegerField(blank=True, null=True)
    unit_cost = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    qty_holds = models.SmallIntegerField(blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    returnable = models.IntegerField(blank=True, null=True)
    in_date = models.DateField(blank=True, null=True)
    in_qty = models.SmallIntegerField(blank=True, null=True)
    exp_date = models.DateField(blank=True, null=True)
    qty_on_hand = models.SmallIntegerField(blank=True, null=True)
    flat_fee = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    psupplier = models.ForeignKey('Supplier', models.DO_NOTHING, related_name = 'psupplier', blank=True, null=True)
    pref_psupplier = models.ForeignKey('Supplier', models.DO_NOTHING, related_name = 'pref_psupplier', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'packaging'


class PackagingUsages(models.Model):
    p_usage_id = models.SmallIntegerField(primary_key=True)
    used_date = models.DateField()
    used_qty = models.SmallIntegerField()
    used_pkg = models.ForeignKey(Packaging, models.DO_NOTHING, related_name='packaging_usage')

    class Meta:
        managed = False
        db_table = 'packaging_usages'


class RecipeAllergies(models.Model):
    ra_id = models.SmallIntegerField(primary_key=True)
    allergy = models.CharField(max_length=30)
    ra_recipe_num = models.ForeignKey('Recipes', models.DO_NOTHING, db_column='ra_recipe_num')

    class Meta:
        managed = False
        db_table = 'recipe_allergies'


class RecipeDiets(models.Model):
    rd_id = models.SmallIntegerField(primary_key=True)
    diet_category = models.CharField(max_length=50)
    rd_recipe_num = models.ForeignKey('Recipes', models.DO_NOTHING, db_column='rd_recipe_num')

    class Meta:
        managed = False
        db_table = 'recipe_diets'


class RecipeIngredients(models.Model):
    ri_id = models.SmallIntegerField(primary_key=True)
    amt = models.SmallIntegerField()
    unit = models.CharField(max_length=10)
    prep = models.CharField(max_length=100)
    ri_ing = models.ForeignKey(Ingredients, models.DO_NOTHING)
    ri_recipe_num = models.ForeignKey('Recipes', models.DO_NOTHING, db_column='ri_recipe_num')

    class Meta:
        managed = False
        db_table = 'recipe_ingredients'


class RecipeInstructions(models.Model):
    inst_id = models.IntegerField(primary_key=True)
    step_no = models.IntegerField(blank=True, null=True)
    step_inst = models.TextField(blank=True, null=True)
    stn_name = models.CharField(max_length=50, blank=True, null=True)
    inst_recipe_num = models.ForeignKey('Recipes', models.DO_NOTHING, db_column='inst_recipe_num', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipe_instructions'


class RecipePackaging(models.Model):
    rp_id = models.IntegerField(primary_key=True)
    amt = models.SmallIntegerField(blank=True, null=True)
    pkg_type = models.CharField(max_length=45, blank=True, null=True)
    rp_pkg = models.ForeignKey(Packaging, models.DO_NOTHING, blank=True, null=True)
    rp_recipe_num = models.ForeignKey('Recipes', models.DO_NOTHING, db_column='rp_recipe_num', blank=True, null=True)
    rp_ing_id = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipe_packaging'


class Recipes(models.Model):
    r_num = models.SmallIntegerField(primary_key=True)
    r_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipes'


class StationIngredients(models.Model):
    si_id = models.SmallIntegerField(primary_key=True)
    si_ing = models.ForeignKey(Ingredients, models.DO_NOTHING, blank=True, null=True)
    si_station_name = models.ForeignKey('Stations', models.DO_NOTHING, db_column='si_station_name', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'station_ingredients'


class StationPackaging(models.Model):
    sp_id = models.SmallIntegerField(primary_key=True)
    sp_pkg = models.ForeignKey(Packaging, models.DO_NOTHING, blank=True, null=True)
    sp_station_name = models.ForeignKey('Stations', models.DO_NOTHING, db_column='sp_station_name', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'station_packaging'


class Stations(models.Model):
    stn_name = models.CharField(primary_key=True, max_length=50)
    num_servings = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stations'


class Supplier(models.Model):
    s_id = models.SmallIntegerField(primary_key=True)
    s_name = models.CharField(max_length=50)
    street = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pcode = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'supplier'


class Users(models.Model):
    u_id = models.PositiveSmallIntegerField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    admin_flag = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'users'
