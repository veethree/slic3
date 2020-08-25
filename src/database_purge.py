from slic3 import db
from slic3.models import Link
import time
import threading
import math

PURGE_INTERVAL = 3600
TIME_LIMIT = 86400

def purge():
	while True:
		print("DB: Purging:")
		data = Link.query.all()
		for item in data:
			if math.floor(time.time()) > item.time_stamp + TIME_LIMIT:
				db.session.delete(item)
				db.session.commit()
				print(str(item.id) + " REMOVED")

		time.sleep(PURGE_INTERVAL)


purge_thread = threading.Thread(target=purge)
purge_thread.start()