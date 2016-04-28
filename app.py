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
	return "Cool"

@app.route('/update', methods=['POST'])
def update_data():
    with open('data.json', 'r+') as data_file:
        current_data = json.load(data_file)
        current_data['classes'] = json.loads(request.form['classes'])
        current_data['rooms'] = json.loads(request.form['rooms'])
        current_data['teachers'] = json.loads(request.form['teachers'])
        current_data['times'] = json.loads(request.form['times'])
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
def generate():
	teachers = []
	courses = []
	rooms = []
	times = []
	for name in json.loads(request.form['teachers']):
		teachers.append(str(name['name']))

	for course in json.loads(request.form['classes']):
		courses.append(str(course['class']))

	for room in json.loads(request.form['rooms']):
		rooms.append(str(room['room']))

	for time in json.loads(request.form['times']):
		days_string = ""
		for day in time['days']:
			days_string += str(day) + ""
		times.append(str(time['start']) + str(time['end']) + days_string)

	print "Times"
	print times
	teachersNumCoursesIn = json.loads(request.form['teachersNumCourses'])
	teachersNumCourses = {}
	# convert from unicode to string
	for teacher in teachersNumCoursesIn:
		teachersNumCourses[str(teacher)] = teachersNumCoursesIn[teacher]
	
	teacher_constraints = {}
	teacher_course_constraints = json.loads(request.form['teachersXcourses'])
	for teacher in teacher_course_constraints:
		if str(teacher) not in teacher_constraints:
			teacher_constraints[str(teacher)] = []
		for constraint in teacher_course_constraints[teacher]:
			teacher_constraints[teacher].append(str(constraint))
	
	teachersXcourses = []
	for teacher in teachers:
		teacher_list = []
		for course in courses:
			if teacher in teacher_constraints:
				if course in teacher_constraints[teacher]:
					teacher_list.append(1)
				elif "not " + course in teacher_constraints[teacher]:
					teacher_list.append(0)
				else:
					teacher_list.append(.5)
			else:
				teacher_list.append(.5)
		teachersXcourses.append(teacher_list)

	course_constraints = {}
	course_room_constraints = json.loads(request.form['coursesXrooms'])
	for course in course_room_constraints:
		if str(course) not in course_constraints:
			course_constraints[str(course)] = []
		for constraint in course_room_constraints[course]:
			course_constraints[course].append(str(constraint))
	
	coursesXrooms = []
	for course in courses:
		course_list = []
		for room in rooms:
			if room in course_constraints:
				if course in course_constraints[room]:
					course_list.append(1)
				elif "not " + course in course_constraints[room]:
					course_list.append(0)
				else:
					course_list.append(.5)
			else:
				course_list.append(.5)
		coursesXrooms.append(course_list)
	

	teacher_constraints = {}
	teacher_time_constraints = json.loads(request.form['teachersXtimes'])
	for teacher in teacher_time_constraints:
		if str(teacher) not in teacher_constraints:
			teacher_constraints[str(teacher)] = []
		for constraint in teacher_time_constraints[teacher]:
			teacher_constraints[teacher].append(str(constraint))

	print "Teacher constraints:"
	print teacher_constraints
	
	teachersXtimes = []
	for teacher in teachers:
		teacher_list = []
		for time in times:
			if teacher in teacher_constraints:
				print "COMPARING"
				print time
				print teacher_constraints[teacher]
				if time in teacher_constraints[teacher]:
					print "found match!"
					teacher_list.append(1)
				elif "not " + time in teacher_constraints[teacher]:
					print "found not match!"
					teacher_list.append(0)
				else:
					teacher_list.append(.5)
			else:
				teacher_list.append(.5)
		teachersXtimes.append(teacher_list)
	
	#print "teachersXtimes:"
	#print teachersXtimes
	
	room_constraints = {}
	room_time_constraints = json.loads(request.form['roomsXtimes'])
	for room in room_time_constraints:
		if str(room) not in room_constraints:
			room_constraints[str(room)] = []
		for constraint in room_time_constraints[room]:
			room_constraints[str(room)].append(str(constraint))
	
	roomsXtimes = []
	for room in rooms:
		room_list = []
		for time in times:
			if room in room_constraints:
				if time in room_constraints[room]:
					room_list.append(1)
				elif "not " + time in room_constraints[room]:
					room_list.append(0)
				else:
					room_list.append(.5)
			else:
				room_list.append(.5)
		roomsXtimes.append(room_list)
	
	#print "roomsXtimes:"
	#print roomsXtimes

	course_constraints = {}
	course_time_constraints = json.loads(request.form['coursesXtimes'])
	for time in course_time_constraints:
		if str(time) not in course_constraints:
			course_constraints[str(time)] = []
		for constraint in course_time_constraints[time]:
			course_constraints[str(time)].append(str(constraint))
	
	coursesXtimes = []
	for course in courses:
		course_list = []
		for time in times:
			if time in course_constraints:
				if course in course_constraints[time]:
					course_list.append(1)
				elif "not " + course in course_constraints[time]:
					course_list.append(0)
				else:
					course_list.append(.5)
			else:
				course_list.append(.5)
		coursesXtimes.append(course_list)
	
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
	for i, row in enumerate(teachersXcourses):
		teacher = teachers[i]	
		cantTeachCourseIndexes = [courseIndex for courseIndex, val in enumerate(row) if val == 0]
		cantTeachCourses = [courses[j] for j in cantTeachCourseIndexes]
		for course in cantTeachCourses:	
			constraintName = teacher+"CantTeachCourse"+course
			defineConstraint([teacher,course], constraintName, 0, 0)

		mustTeachCourseIndexes = [courseIndex for courseIndex, val in enumerate(row) if val == 1]
		mustTeachCourses = [courses[j] for j in mustTeachCourseIndexes]
		for course in mustTeachCourses:	
			constraintName = teacher+"MustTeachCourse"+course
			defineConstraint([teacher,course], constraintName, 1, 1)

	#for i, row in enumerate(teachersXrooms):
	#	teacher = teachers[i]	
	#	cantTeachRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 0]
	#	cantTeachRoom = [rooms[j] for j in cantTeachRoomIndexes]
	#	for room in cantTeachRoom:	
	#		constraintName = teacher+"CantTeachRoom"+room
	#		defineConstraint([teacher,room], constraintName, 0, 0)

#		mustTeachRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 1]
#		mustTeachRoom = [rooms[j] for j in mustTeachRoomIndexes]
#		for room in mustTeachRoom:	
#			constraintName = teacher+"MustTeachRoom"+room
#			defineConstraint([teacher,room], constraintName, 1, 1)

	for i, row in enumerate(teachersXtimes):
		teacher = teachers[i]	
		cantTeachTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 0]
		cantTeachTime = [times[j] for j in cantTeachTimeIndexes]
		for time in cantTeachTime:	
			constraintName = teacher+"CantTeachTime"+time
			defineConstraint([teacher,time], constraintName, 0, 0)

		mustTeachTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 1]
		mustTeachTime = [times[j] for j in mustTeachTimeIndexes]
		for time in mustTeachTime:	
			constraintName = teacher+"MustTeachTime"+time
			defineConstraint([teacher,time], constraintName, 1, 1)

	for i, row in enumerate(coursesXrooms):
		course = courses[i]	
		cantBeTaughtInRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 0]
		cantBeTaughtInRoom = [rooms[j] for j in cantBeTaughtInRoomIndexes]
		for room in cantBeTaughtInRoom:	
			constraintName = course+"CantBeTaughtInRoom"+room
			defineConstraint([course,room], constraintName, 0, 0)

		mustBeTaughtInRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 1]
		mustBeTaughtInRoom = [rooms[j] for j in mustBeTaughtInRoomIndexes]
		for room in mustBeTaughtInRoom:	
			constraintName = course+"MustBeTaughtInRoom"+room
			defineConstraint([course,room], constraintName, 1, 1)

	for i, row in enumerate(coursesXtimes):
		course = courses[i]	
		cantBeTaughtAtTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 0]
		cantBeTaughtAtTime = [times[j] for j in cantBeTaughtAtTimeIndexes]
		for time in cantBeTaughtAtTime:	
			constraintName = course+"CantBeTaughtAtTime"+time
			defineConstraint([course,time], constraintName, 0, 0)

		mustBeTaughtAtTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 1]
		mustBeTaughtAtTime = [times[j] for j in mustBeTaughtAtTimeIndexes]
		for time in mustBeTaughtAtTime:	
			constraintName = course+"MustBeTaughtAtTime"+time
			defineConstraint([course,time], constraintName, 1, 1)

	for i, row in enumerate(roomsXtimes):
		room = rooms[i]	
		cantOccupyAtTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 0]
		cantOccupyAtTime = [times[j] for j in cantOccupyAtTimeIndexes]
		for time in cantOccupyAtTime:	
			constraintName = room+"CantOccupyAtTime"+time
			defineConstraint([room,time], constraintName, 0, 0)

		mustOccupyAtTimeIndexes = [timeIndex for timeIndex, val in enumerate(row) if val == 1]
		mustOccupyAtTime = [times[j] for j in mustOccupyAtTimeIndexes]
		for time in mustOccupyAtTime:	
			constraintName = room+"MustOccupyAtTime"+time
			defineConstraint([room,time], constraintName, 1, 1)

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
	print allOverlaps
	
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
		print teachers	
		#Teachers can only be occupied <=1 times per overlapping time	
		for t in teachers:
			subjects = (t, checkStrings)
			print t+"OccupiedAtMostOnceDuringOverlap"+checkStrings[0]+"And"+checkStrings[1]
			defineOverlapConstraint(subjects, t+"OccupiedAtMostOnceDuringOverlap"+checkStrings[0]+"And"+checkStrings[1], 0, 1)
		#Rooms can only be occupied <=1 times per overlapping time
		for r in rooms:
			subjects = (r, checkStrings)
			print r+"OccupiedAtMostOnceDuringOverlap"+checkStrings[0]+"And"+checkStrings[1]
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

	
        #print "---OBJECTIVE DESIRABILITY VALUES---"
	for te in teachers:
		for c in courses:
			for r in rooms:
				for ti in times:
					colName = te+' - '+c+' - '+r+' - '+ti
					print colName, lp.obj[colName]
	print

	print "---CONSTRAINTS---"
	for row in lp.rows:
		print row.name+" has a sum bound to be between",row.bounds[0], "and",row.bounds[1]

	print

	print "---SOLUTION---"

	#string_solution = ""
	results = {"results": []}
	for c in lp.cols:
		if c.primal!=0:
			pieces = c.name.split(" - ")
			to_add = {"teacher": pieces[0], "course": pieces[1], "room": pieces[2], "time": pieces[3]} 
			#to_add = "{} = {}".format(c.name, c.primal)
			results['results'].append(to_add)
			#string_solution += to_add

	print results

    	return json.dumps(results);

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Error: Specify server IP as first arg. Eg. python app.py 127.0.0.1"
        exit(1)
    else:
        ip = str(sys.argv[1])
    app.run(host=ip, port=80)
