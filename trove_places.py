import os
from collections import OrderedDict
from urlparse import urlparse
from flask import Flask
from flask import request
from flask import render_template, jsonify, Response
from pymongo import MongoClient, GEO2D, Connection
from bson.json_util import dumps
app = Flask(__name__)

MONGO_URL = os.environ.get('MONGOHQ_URL')
 
if MONGO_URL:
	client = MongoClient(MONGO_URL)
	db = client.get_default_database()
else:
	client = MongoClient()
	db = client['trove_places']
  	
@app.route('/')
def search():
    return render_template('search_form.html')

@app.route('/places')
def get_place():
	place = []
	placename = request.args.get('name', None)
	state = request.args.get('state', None)
	if placename and state:
		places = db.places
		place = places.find({'name_lower': placename.lower(), 'state': state, 'display': 'y'})
	return Response(dumps(place), mimetype='application/json')

@app.route('/titles')
def find_near_titles():
	results = []
	lon = request.args.get('lon', None)
	lat = request.args.get('lat', None)
	if lon and lat:
		titles = db.titles
		titles.ensure_index([('places.loc', GEO2D)], min=-500, max=500)
		near_titles = titles.find({"places.loc": {"$near": [float(lon), float(lat)]}}).limit(20)
		results = OrderedDict((v['_id'], v) for v in near_titles).values()
	return Response(dumps(results[:10]), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)