from flask import render_template, request, redirect, flash, url_for
from slic3 import app, db
from slic3.models import Link
import re
import string
from random import randrange
import time
import math

example_link = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FdQw4w9WgXcQ%2Fmaxresdefault.jpg&imgrefurl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&tbnid=9ynv09zkGi7fMM&vet=12ahUKEwiDxOfP8anrAhUIwAIHHYLGDlMQMygBegUIARDOAQ..i&docid=6s4NuhB18CEGIM&w=1280&h=720&q=rick%20astley&ved=2ahUKEwiDxOfP8anrAhUIwAIHHYLGDlMQMygBegUIARDOAQ"
# This is a regex that validates a URL, I stole it from Django.
# Source: https://github.com/django/django/blob/stable/1.3.x/django/core/validators.py#L45
is_url = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

# Generates a random string. Used for the short URLS's
def random_string(length):
	res = ""
	bank = string.ascii_uppercase + string.ascii_lowercase + string.digits
	for i in range(length):
		res += bank[randrange(len(bank))]
	return res

def time_stamp():
	return math.floor(time.time())

# Creates & adds a new short link to the database
def new_short_url(long_url):
	db_link = Link.query.filter_by(long_url=long_url).first()
	if db_link:
		short_url = db_link.short_url
	else:
		short_url = random_string(4)
		if Link.query.filter_by(short_url=short_url).first():
			new_short_url(long_url)
		else:
			new = Link(long_url=long_url, short_url=short_url, time_stamp=time_stamp())
			db.session.add(new)
			db.session.commit()

	return short_url

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/active_links")
def active_links():
	data = Link.query.all()
	my_url = request.base_url.rstrip(string.ascii_lowercase + "_")
	return render_template("active_links.html", data=data, my_url=my_url)

@app.route("/about")
def about():
	my_url = request.base_url.rstrip(string.ascii_lowercase + "_")
	example_short = new_short_url(example_link)
	return render_template("about.html", my_url=my_url, example_link=example_link, example_short=example_short)

@app.route("/new_link", methods=["GET", "POST"])
def new_link():
	if request.method == "POST":
		my_url = request.base_url.rstrip(string.ascii_lowercase + "_")
		short_url = ""
		form_url = request.form.get("url")
		if not(re.match(is_url, form_url)):
			flash("Invalid link!", "error")
			return redirect(url_for("index"))
		else:
			short_url = new_short_url(form_url)

	return render_template("new_link.html", my_url=my_url, short_url=short_url)

@app.route("/<short_url>")
def red(short_url):
	my_url = request.base_url.rstrip(string.ascii_lowercase + "_")
	db_link = Link.query.filter_by(short_url=short_url).first()
	if db_link:
		return redirect(db_link.long_url, code=302)
	else:
		flash("404: URL Not found", "error")
		return redirect(url_for("index"))	




















