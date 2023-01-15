import json

# import flask
from flask import Flask, request
from Db import Db, Puppy

print(__name__)
app = Flask(__name__)

PuppyDB = Db([
    Puppy('Miyumi', 'Akita', '2018-03-10', 0),
    Puppy('Tova', 'Poodle', '2017-06-30', 1)
])


@app.get("/api/puppies")
def get_puppies():
    return json.dumps(
        PuppyDB.get_all(),
        default=lambda pup: pup.__dict__)


@app.post("/api/puppies")
def add_puppy():
    return json.dumps(
        PuppyDB.add_one(**request.json),
        default=lambda pup: pup.__dict__)


@app.route("/Hello")
def index():
    return "Hello world"


app.run("localhost", 3000)
