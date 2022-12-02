from django.db import connection

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
