import glpk
teachers = ["Alex", "Brendan", "Joseph", "David"]
courses = ["127a", "127b", "227", "436"]
rooms = ["r1", "r2", "r3", "r4"]
times = ["1200","1300","1400","1500"]

teachersNumCourses = {"Alex":1, "Brendan":1, "Joseph":1, "David":1}
teachersXcourses = 	[[.5, .5,  0,  0],
			 [.5,  0, .5,  0],
			 [ 0, .5,  0,  1],
			 [ 1,  0, .5, .5]]

teachersXrooms =	[[.5, .5,  0, .5],
			 [.5,  1,  0,  0],
			 [.5,  0,  0, .5],
			 [ 0, .5, .5, .5]]

teachersXtimes =	[[.5, .5,  .5, .5],
			 [.5,  0,  0, .5],
			 [ 1,  0,  0, .5],
			 [ 0, .5, .5, .5]]

coursesXrooms = 	[[.5, .5,  0, .5],
			 [ 0,  1, .5, .5],
			 [.5, .5, .5, .5],
			 [.5, .5, .5, .5]]

coursesXtimes = 	[[ 0,  0, .5, .5],
			 [ 0, .5,  0, .5],
			 [.5, .5, .5, .5],
			 [.5, .5,  0, .5]]

roomsXtimes = 		[[.5, .5, .5, .5],
			 [.5, .5, .5, .5],
			 [ 0, .5,  0, .5],
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

for i, row in enumerate(teachersXrooms):
	teacher = teachers[i]	
	cantTeachRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 0]
	cantTeachRoom = [rooms[j] for j in cantTeachRoomIndexes]
	for room in cantTeachRoom:	
		constraintName = teacher+"CantTeachRoom"+room
		defineConstraint([teacher,room], constraintName, 0, 0)

	mustTeachRoomIndexes = [roomIndex for roomIndex, val in enumerate(row) if val == 1]
	mustTeachRoom = [rooms[j] for j in mustTeachRoomIndexes]
	for room in mustTeachRoom:	
		constraintName = teacher+"MustTeachRoom"+room
		defineConstraint([teacher,room], constraintName, 1, 1)

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

#Solve the problem and print all the data
print
print "Errors: {}".format(lp.simplex())
print lp.status
print "Errors: {}".format(lp.integer())
print "Status: {}".format(lp.status)
print

print "---OBJECTIVE DESIRABILITY VALUES---"
for te in teachers:
	for c in courses:
		for r in rooms:
			for ti in times:
				colName = te+'-'+c+'-'+r+'-'+ti
				#print colName, lp.obj[colName]
print

print "---CONSTRAINTS---"
for row in lp.rows:
	print row.name+" has a sum bound to be between",row.bounds[0], "and",row.bounds[1]

print

print "---SOLUTION---"

for c in lp.cols:
	if c.primal!=0:
		print "{} = {}".format(c.name, c.primal)