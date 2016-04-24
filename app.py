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
	shutil.copyfile("data_example.json", "data.json")
	#with open("data_example.json", 'r') as f:
	#	data_stuff = json.load(f)
	#	with open("data.json", 'w') as x:
	#		json.dump(data_stuff, x)
		#print data
		#x.seek(0)
		#data_string = str(json.dumps(data))
		#print data_string
		#x.("HEY")
		#x.truncate()
		#print "DID IT"
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
	print teachers

	for course in json.loads(request.form['classes']):
		courses.append(str(course['class']))
	print courses

	for room in json.loads(request.form['rooms']):
		rooms.append(str(room['room']))
	print rooms

	for time in json.loads(request.form['times']):
		times.append(str(time['start']) + str(time['end']))		
	print times

	teachersNumCoursesIn = json.loads(request.form['teachersNumCourses'])
	teachersNumCourses = {}
	# convert from unicode to string
	for teacher in teachersNumCoursesIn:
		print str(teacher)
		print teachersNumCoursesIn[teacher]
		teachersNumCourses[str(teacher)] = teachersNumCoursesIn[teacher]
	print "teachersNumCourses"
	print teachersNumCourses
	
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

	print "teachersXcourses:"
	print teachersXcourses
		
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
	
	print "coursesXrooms:"
	print coursesXrooms		

	teacher_constraints = {}
	teacher_time_constraints = json.loads(request.form['teachersXtimes'])
	for teacher in teacher_time_constraints:
		if str(teacher) not in teacher_constraints:
			teacher_constraints[str(teacher)] = []
		for constraint in teacher_time_constraints[teacher]:
			teacher_constraints[teacher].append(str(constraint))
	
	teachersXtimes = []
	for teacher in teachers:
		teacher_list = []
		for time in times:
			if teacher in teacher_constraints:
				if time in teacher_constraints[teacher]:
					teacher_list.append(1)
				elif "not " + time in teacher_constraints[teacher]:
					teacher_list.append(0)
				else:
					teacher_list.append(.5)
			else:
				teacher_list.append(.5)
		teachersXtimes.append(teacher_list)
	
	print "teachersXtimes:"
	print teachersXtimes
	
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
	
	print "roomsXtimes:"
	print roomsXtimes

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
	
	print "courseXtimes:"
	print coursesXtimes

	coursesXtimes = 	[[ 0,  0, .5, .5],
				 [ 0, .5,  0, .5],
				 [.5, .5, .5, .5],
				 [.5, .5,  0, .5]]

	lp = glpk.LPX()
	lp.obj.maximize = True

	def defineConstraint(subjects, name, lowerbound, upperbound):
		constraint = []	
		rnew = lp.rows.add(1)
		lp.rows[rnew].name = name
		for col in lp.cols:
			if all(subject in col.name for subject in subjects):
				constraint.insert(0, (col.name, 1))
		lp.rows[constraintName].matrix = constraint
		lp.rows[constraintName].bounds = lowerbound, upperbound

	#####Define columns (variables)#####
	possibilities = [[teacher, course, room, time] for teacher in teachers for course in courses for room in rooms for time in times]
	for [teacher, course, room, time] in possibilities:
		cnew = lp.cols.add(1)
		colName = teacher+'-'+course+'-'+room+'-'+time
		lp.cols[cnew].name = colName
		lp.cols[colName].kind = bool
		lp.cols[colName].bounds = 0, 1

	#####Define constraints#####

	#Number of courses taught by each teacher
	for t in teachers:
		constraintName = t+"Numcourses"
		numClasses = teachersNumCourses[t]
		defineConstraint([t], constraintName, numClasses, numClasses)

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
					colName = te+'-'+c+'-'+r+'-'+ti
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
			pieces = c.name.split("-")
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
