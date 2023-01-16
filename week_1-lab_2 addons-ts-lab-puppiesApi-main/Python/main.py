import json
from flask import Flask, request
from Db import Db, Puppy

print(__name__)
app = Flask(__name__)

PuppyDB = Db([
    Puppy('Miyumi', 'Akita', '2018-03-10', 0),
    Puppy('Tova', 'Poodle', '2017-06-30', 1)])


@app.route("/")
def index():
    return "<h1>Hello world</h1>\n<p>Try <a href=\"http://localhost:3000/api/puppies\">/api/puppies</a><p>"


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


@app.get("/api/puppies/<puppy_id>")
def get_puppy(puppy_id):
    try:
        return json.dumps(
            PuppyDB.get_one(puppy_id),
            default=lambda pup: pup.__dict__)
    except Exception as e:
        return str(e)


@app.patch("/api/puppies/<puppy_id>")
def get_puppy(puppy_id):
    try:
        return json.dumps(
            PuppyDB.update_one(puppy_id, **request.json),
            default=lambda pup: pup.__dict__)
    except Exception as e:
        return str(e)


app.run("localhost", 3000)

