# Alex Reed
# CSc 436
# This thing find overlapping times in a schedule, ALL of them
# And displays them/makes the data available for future shenanigans
# who up?


# Function that takes a list of times and detected overlaps
# Returns list of overlaps in tuple form (class1, class2)
def whoTfOverlap(dayList):
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

# These are the (hard-coded) times given, but my boy JSON will be in this format
times = [
         {"start" : 1000, "end" : 1150, "days" : ["M", "W"]},
         {"start" : 1100, "end" : 1150, "days" : ["M", "W", "F"]},
         {"start" : 1200, "end" : 1250, "days" : ["M", "W", "F"]},
         {"start" : 1300, "end" : 1350, "days" : ["M", "W", "F"]},
         {"start" : 1400, "end" : 1450, "days" : ["M", "W", "F"]}
         ]
# Store times according to day for day by day analysis, this is for taking care of the special section times
# or the Monday Wednesday class situations.
mTimes = []
tTimes = []
wTimes = []
thTimes = []
fTimes = []

# Adding the times to the respective day lists
# If this takes too much memory feel free to yell at me

for classTime in times:
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
mOverlaps = whoTfOverlap(mTimes)
tOverlaps = whoTfOverlap(tTimes)
wOverlaps = whoTfOverlap(wTimes)
thOverlaps = whoTfOverlap(thTimes)
fOverlaps = whoTfOverlap(fTimes)

# For Brendan I hope he thinks im cute
# I'm just extending them not using some library that'll do this in one line
allOverlaps = []
allDays = [mOverlaps, tOverlaps, wOverlaps, thOverlaps, fOverlaps]
for dayList in allDays:
	for ele in dayList:
		if ele not in allOverlaps:
			allOverlaps.append(ele)
print allOverlaps
