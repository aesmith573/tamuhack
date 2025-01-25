import json
import requests
from flask import Flask

app = Flask(__name__)

#To run in console
#flask --app app run

#pip install requests

@app.route("/")
def hello_world():
    return "<p>Tamu Hack</p>"