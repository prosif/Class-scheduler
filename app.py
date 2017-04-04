from flask import Flask, request, url_for, render_template
from flask.ext.cors import CORS
import random
import json
import glpk
import sys
from pprint import pprint
import shutil 

app = Flask(__name__)
CORS(app)

'''loads_byteified and _byteify were taken from http://stackoverflow.com/questions/956867/how-to-get-string-objects-instead-of-unicode-ones-from-json-in-python/13105359#13105359'''
def loads_byteified(json_text):
    return _byteify(
        json.loads(json_text, object_hook=_byteify),
        ignore_dicts=True
    )

def _byteify(data, ignore_dicts = False):
    if isinstance(data, unicode):
        return data.encode('utf-8')
    if isinstance(data, list):
        return [ _byteify(item, ignore_dicts=True) for item in data ]
    if isinstance(data, dict) and not ignore_dicts:
        return {
            _byteify(key, ignore_dicts=True): _byteify(value, ignore_dicts=True)
            for key, value in data.iteritems()
        }
    return data

@app.route('/', methods=['GET'])
def root():
    # get ip address from arg
    ip = str(sys.argv[1])
    return render_template('index.html', ip=ip)

@app.route('/data', methods=['GET'])
def data():
    with open("data.json") as f:
        data = json.load(f)
    return json.dumps(data)

@app.route('/reset', methods=['POST'])
def reset_data():
	shutil.copyfile("data_empty.json", "data.json")

@app.route('/update', methods=['POST'])
def update_data():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
	for constraint in ('classes', 'rooms', 'teachers', 'times'):
        	current_data[constraint] = json.loads(request.form[constraint])
        data_file.seek(0)
        json.dump(current_data, data_file)
        data_file.truncate()

@app.route('/css/<filename>', methods=['GET'])
def css(filename):
    return app.send_static_file('css/' + filename)

@app.route('/js/<filename>', methods=['GET'])
def js(filename):
    return app.send_static_file('js/' + filename)

@app.route("/generate", methods=['POST'])
def generate():
	teachers = [name['name'] 	 for name   in loads_byteified(request.form['teachers'])]
	courses  = [course['class']      for course in loads_byteified(request.form['classes'])]
	rooms 	 = [room['room'] 	 for room   in loads_byteified(request.form['rooms'])]
	rooms 	+= [room 		 for room   in loads_byteified(request.form['coursesXrooms']) if (room[0:5] == 'other')]
	times = []
	for time in json.loads(request.form['times']):
		days_string = ""
		for day in time['days']:
			days_string += str(day) + ""
		times.append(str(time['start']) + str(time['end']) + days_string)
	
	teachersNumCourses = loads_byteified(request.form['teachersNumCourses'])
	
	lp = glpk.LPX()
	lp.obj.maximize = True

	def defineConstraint(subjects, name, lowerbound, upperbound):
		constraint = []	
		rnew = lp.rows.add(1)
		lp.rows[rnew].name = name
		for col in lp.cols:
			if all(subject in col.name for subject in subjects):
				constraint.insert(0, (col.name, 1))
		lp.rows[name].matrix = constraint
		lp.rows[name].bounds = lowerbound, upperbound

	#####Define columns (variables)#####
	possibilities = [[teacher, course, room, time] for teacher in teachers for course in courses for room in rooms for time in times]
	for [teacher, course, room, time] in possibilities:
		cnew = lp.cols.add(1)
		colName = teacher+' - '+course+' - '+room+' - '+time
		lp.cols[cnew].name = colName
		lp.cols[colName].kind = bool
		lp.cols[colName].bounds = 0, 1

	#####Define constraints#####

	#Number of courses taught by each teacher
	for t in teachers:
		constraintName = t+"Numcourses"
		numClasses = teachersNumCourses[t]
		defineConstraint([t], constraintName, 0, numClasses)

	#Each class can only be taught once
	for c in courses:
		#Add a new row representing possibilities for a single courses (which we need to bound to 1)
		constraintName = c+"TaughtOnce"
		defineConstraint([c], constraintName, 1, 1)

	#Each room can only be occupied once per time
	for r in rooms:
		for t in times:
			#Add a new row representing room at specific time (occupied <=1 times)
			constraintName = r+"OccupiedOnceAt"+t
			defineConstraint([r,t], constraintName, 0, 1)

	#Each teacher can only be occupied once per time
	for te in teachers:
		for ti in times:
			#Add a new row representing teacher at specific time (occupied <=1 times)
			constraintName = te+"OccupiedOnceAt"+ti
			defineConstraint([te,ti], constraintName, 0, 1)

	#Define constraints provided by tables
	te_c_cons = loads_byteified(request.form['teachersXcourses'])
	for teacher in teachers:
		if teacher in te_c_cons:
			for course in te_c_cons[teacher]:
				magnitude = 0 if course[:3] == 'not' else 1
				constraintName = teacher+"TeachCourse"+course
				defineConstraint([teacher,course], constraintName, magnitude, magnitude)
	
	te_ti_cons = loads_byteified(request.form['teachersXtimes'])
	for teacher in teachers:
		if teacher in te_ti_cons:
			for time in te_ti_cons[teacher]:
				magnitude = 0 if time[:3] == 'not' else 1
				constraintName = teacher+"TeachTime"+time
				defineConstraint([teacher,time], constraintName, magnitude, magnitude)

	c_r_cons = loads_byteified(request.form['coursesXrooms'])
	for room in rooms:
		if room in c_r_cons:
			for course in c_r_cons[room]:
				magnitude = 0 if room[:3] == 'not' else 1
				constraintName = course+"TaughtInRoom"+room
				defineConstraint([course,room], constraintName, magnitude, magnitude)

	c_ti_cons = loads_byteified(request.form['coursesXtimes'])
	for time in times:
		if time in c_ti_cons:
			for course in c_ti_cons[time]:
				magnitude = 0 if time[:3] == 'not' else 1
				constraintName = course+"TaughtAtTime"+time
				defineConstraint([course,time], constraintName, magnitude, magnitude)

	r_ti_cons = loads_byteified(request.form['roomsXtimes'])
	for room in rooms:
		if room in r_ti_cons:
			for time in r_ti_cons[room]:
				magnitude = 0 if time[:3] == 'not' else 1
				constraintName = room+"OccupyAtTime"+time
				defineConstraint([room,time], constraintName, magnitude, magnitude)

	#Determine overlapping times
	def whoOverlap(dayList):
		conflicts = []
	    # Cover every possible combination of classes
	    # Mr International
		for i in range(len(dayList)):
			for j in range(i+1, len(dayList)):
				x = dayList[i]
				y = dayList[j]
	    
	    		# DALE
				if (x['end']>=y['start'] and x['start']<=y['start']):
					conflicts.append((x,y))
		return conflicts

	# Store times according to day for day by day analysis, this is for taking care of the special section times
	# or the Monday Wednesday class situations.
	mTimes = []
	tTimes = []
	wTimes = []
	thTimes = []
	fTimes = []

	# Adding the times to the respective day lists
	# If this takes too much memory feel free to yell at me
	jsonTimes = json.loads(request.form['times'])
	for classTime in jsonTimes:
	    if "M" in classTime['days']:
		mTimes.append(classTime)
	    if "T" in classTime['days']:
		tTimes.append(classTime)
	    if "W" in classTime['days']:
		wTimes.append(classTime)
	    if "TH" in classTime['days']:
		thTimes.append(classTime)
	    if "F" in classTime['days']:
		fTimes.append(classTime)

	# Now I'm sorting each of the day lists by their start times so I can easily compare when
	# an overlap is happening. If you don't like that then sorry you big silly billy
	mTimes = sorted(mTimes, key=lambda k: k['start'])
	tTimes = sorted(tTimes, key=lambda k: k['start']) 
	wTimes = sorted(wTimes, key=lambda k: k['start']) 
	thTimes = sorted(thTimes, key=lambda k: k['start']) 
	fTimes = sorted(fTimes, key=lambda k: k['start']) 

	# Who tf overlappin out here???
	mOverlaps = whoOverlap(mTimes)
	tOverlaps = whoOverlap(tTimes)
	wOverlaps = whoOverlap(wTimes)
	thOverlaps = whoOverlap(thTimes)
	fOverlaps = whoOverlap(fTimes)

	# I'm just extending them not using some library that'll do this in one line
	allOverlaps = []
	allDays = [mOverlaps, tOverlaps, wOverlaps, thOverlaps, fOverlaps]
	for dayList in allDays:
		for ele in dayList:
			if ele not in allOverlaps:
				allOverlaps.append(ele)	
	
	def defineOverlapConstraint((teacher, times), name, lowerbound, upperbound):
		constraint = []	
		rnew = lp.rows.add(1)
		lp.rows[rnew].name = name
		for col in lp.cols:
			if [i for i in times if i in col.name] and teacher in col.name:
				constraint.insert(0, (col.name, 1))
		lp.rows[name].matrix = constraint
		lp.rows[name].bounds = lowerbound, upperbound
	
	for (overlap1, overlap2) in allOverlaps:
		laps=[overlap1,overlap2]
		checkStrings = []
		for overlap in laps:	
			my_days_string = " "
			for my_day in overlap['days']:
				my_days_string += str(my_day) + " "
			checkStrings.append(str(overlap['start']) + '-' + str(overlap['end']) + my_days_string)
		#Teachers can only be occupied <=1 times per overlapping time	
		for t in teachers:
			subjects = (t, checkStrings)
			defineOverlapConstraint(subjects, t+"OccupiedAtMostOnceDuringOverlap"+checkStrings[0]+"And"+checkStrings[1], 0, 1)
		#Rooms can only be occupied <=1 times per overlapping time
		for r in rooms:
			subjects = (r, checkStrings)
			defineOverlapConstraint(subjects, r+"OccupiedAtMostOnceDuringOverlap"+checkStrings[0]+"And"+checkStrings[1], 0, 1)
	try:
        	#Solve the problem and print all the data
		print
		print "Errors: {}".format(lp.simplex())
		print "Errors: {}".format(lp.integer())
		print "Status: {}".format(lp.status)
		print

	except:
		print "FAILURE"
		return "nofeas", 400

	results = {"results": []}
	for c in lp.cols:
		if c.primal!=0:
			pieces = c.name.split(" - ")
			to_add = {"teacher": pieces[0], "course": pieces[1], "room": pieces[2], "time": pieces[3]} 
			#to_add = "{} = {}".format(c.name, c.primal)
			results['results'].append(to_add)
			#string_solution += to_add

    	return json.dumps(results);

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Error: Specify server IP as first arg. Eg. python app.py 127.0.0.1"
        exit(1)
    else:
        ip = str(sys.argv[1])
    app.run(host=ip, port=80)
