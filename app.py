from flask import Flask, request, url_for, send_from_directory
from flask.ext.cors import CORS
import random
import json
from pprint import pprint

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def root():
    return app.send_static_file('index.html')


@app.route('/data', methods=['GET'])
def data():
    with open("data.json") as f:
        data = json.load(f)
    return json.dumps(data)


@app.route('/rooms', methods=['POST'])
def create_room():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
        current_data['rooms'] = json.loads(request.form['rooms'])
        data_file.seek(0)
        json.dump(current_data, data_file)
        data_file.truncate()
    return "Cool"


@app.route('/teachers', methods=['POST'])
def create_teacher():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
        current_data['teachers'] = json.loads(request.form['teachers'])
        data_file.seek(0)
        json.dump(current_data, data_file)
        data_file.truncate()
    return "Cool"


@app.route('/times', methods=['POST'])
def create_time():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
        current_data['times'] = json.loads(request.form['times'])
        data_file.seek(0)
        json.dump(current_data, data_file)
        data_file.truncate()
    return "Cool"


@app.route('/classes', methods=['POST'])
def create_class():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
        current_data['classes'] = json.loads(request.form['classes'])
        data_file.seek(0)
        json.dump(current_data, data_file)
        data_file.truncate()
    return "Cool"


@app.route('/css/<filename>', methods=['GET'])
def css(filename):
    return app.send_static_file('css/' + filename)


@app.route('/js/<filename>', methods=['GET'])
def js(filename):
    return app.send_static_file('js/' + filename)


@app.route("/generate", methods=['POST'])
def hello():
    teachers = json.loads(request.form['teachers'])
    classes = json.loads(request.form['classes'])
    rooms = json.loads(request.form['rooms'])
    times = json.loads(request.form['times'])

    try:
        teacher_constraints = json.loads(request.form['teacher_constraints'])
        class_constraints = json.loads(request.form['class_constraints'])
        room_constraints = json.loads(request.form['room_constraints'])
    except:
        pass

    teachers_dict = {}
    classes_dict = {}
    rooms_dict = {}
    times_dict = {}

    teacher_constraints_dict = {}
    class_constraints_dict = {}
    room_constraints_dict = {}

    for teacher in teachers:
        if str(teacher['name']) not in teachers_dict:
            teachers_dict[str(teacher['name'])] = {}

    for _class in classes:
        if str(_class['class']) not in teachers_dict:
            classes_dict[str(_class['class'])] = {}

    for room in rooms:
        if str(room['room']) not in rooms_dict:
            rooms_dict[str(room['room'])] = {}

    for time in times:
        if str(time['time']) not in times_dict:
            times_dict[str(time['time'])] = {}

    teachers_len = len(teachers_dict.keys())
    times_len = len(times_dict.keys())
    rooms_len = len(rooms_dict.keys())
    times_len = len(times_dict.keys())

    thang = random.randint(0, teachers_len - 1)

    final_schedule = {}
    for _class in classes_dict:
        teacher_to_teach = teachers_dict.keys()[random.randint(0, teachers_len - 1)]
        time_to_teach = times_dict.keys()[random.randint(0, times_len - 1)]
        room_to_teach = rooms_dict.keys()[random.randint(0, rooms_len - 1)]
        final_schedule[_class] = {"class": _class, "teacher": teacher_to_teach, "room": room_to_teach, "time": time_to_teach}

    return json.dumps(final_schedule)

if __name__ == "__main__":
    app.run()
