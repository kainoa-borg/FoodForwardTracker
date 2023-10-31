from django.db import connection
from .models import Households
from decimal import *

def execute_query(queryString, keys, many=False):
	with connection.cursor() as cursor:
		cursor.execute(queryString)
		result = []
		if many: 
			data = cursor.fetchall()
			for row in data:
				result.append(dict(zip(keys, row)))
		else:
			data = cursor.fetchone()
			result = dict(zip(keys,data))

		return result

def household_servings_list():
	unpaused_households = Households.objects.filter(paused_flag = False)
	servings_list = []
	for household in unpaused_households:
		# Calculate meal servings for this household
		hh_meal_servings = Decimal(household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5))
		hh_snack_servings = Decimal(household.num_adult + household.num_child_gt_6 + household.num_child_lt_6)
		servings_list.append({'household': household, 'm_servings': hh_meal_servings, 's_servings': hh_snack_servings})
	servings_list = sorted(servings_list, key=lambda x: x['m_servings'], reverse=True)

	return servings_list