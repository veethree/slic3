from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import string
from random import randrange

app = Flask(__name__)
app.config["SECRET_KEY"] = "cpCvdY0GfoJAIDYXCz9ChDkDBO66RPYn"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

from slic3 import routes

def random_string(length):
	res = ""
	bank = string.ascii_uppercase + string.ascii_lowercase + string.digits
	for i in range(length):
		res += bank[randrange(len(bank))]
	return res