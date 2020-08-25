from slic3 import db

class Link(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	long_url = db.Column(db.String(500), unique=True, nullable=False)
	short_url = db.Column(db.String(50), unique=True, nullable=False)
	time_stamp = db.Column(db.Integer())

	def __repr__(self):
		return f"Link('{self.long_url}', '{self.short_url}', '{self.time_stamp}')"