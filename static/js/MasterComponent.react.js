import React from 'react';
import $ from 'jquery';
import RoomsTable from './RoomsTable.react.js';
import ScheduleTable from './ScheduleTable.react.js';
import TeacherCountTable from './TeacherCountTable.react.js';
import TeacherTimeTable from './TeacherTimeTable.react.js';
import RoomTimeTable from './RoomTimeTable.react.js';
import TeachersTable from './TeachersTable.react.js';
import TimesTable from './TimesTable.react.js';
import DataForm from './DataForm.react.js';

var MasterComponent = React.createClass({
    displayName: "MasterComponent",

    getInitialState: function(){
        return({
            teacherConstraints: {},
            roomConstraints: {},
            timeConstraints: {},
            teacherTimeConstraints: {},
            roomTimeConstraints: {},
	    teacherCounts: null,
	    display: {
		'RoomsTable': false, 
		'ScheduleTable': false, 
		'TeacherCountTable': false, 
		'TeacherTimeTable': false, 
		'RoomTimeTable': false, 
		'TeachersTable': false, 
		'TimesTable': false, 
		'DataForm': false
	    },
	    loading: false
        });
    },

    componentDidMount: function(){
        $.ajax({
            type: 'GET',
            url: 'http://' + serverIP +'/data',
            success: function(response){
                var parsed = JSON.parse(response);
                this.setState({
                    teachers: parsed.teachers,
                    classes: parsed.classes,
                    times: parsed.times,
                    rooms: parsed.rooms
                }, function(){
		    var teacherCountObj = {};
		    this.state.teachers.map(function(teacher){
			if(!(teacher.name in teacherCountObj)){
				teacherCountObj[teacher.name] = 0;
			}
		   });
		   this.setState({teacherCounts: teacherCountObj});
		}.bind(this));
            }.bind(this),
        });
    },

    updateTeacherCounts: function(newCounts){
	this.setState({teacherCounts: newCounts});
    },

    onToggleTimesTableDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['TimesTable'] = !tempDisplay['TimesTable'];
	this.setState({
		display: tempDisplay
	});
    }, 

    onToggleRoomsTableDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['RoomsTable'] = !tempDisplay['RoomsTable'];
	this.setState({
		display: tempDisplay
	});

    }, 

    onToggleScheduleTable: function(){
	var tempDisplay = this.state.display;
	tempDisplay['ScheduleTable'] = !tempDisplay['ScheduleTable'];
	this.setState({
		display: tempDisplay
	});

    }, 
 
    onToggleTeacherCountTableDisplay: function(){
    	var tempDisplay = this.state.display;
	tempDisplay['TeacherCountTable'] = !tempDisplay['TeacherCountTable'];
	this.setState({
		display: tempDisplay
	});

    }, 

    onToggleTeacherTimeTableDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['TeacherTimeTable'] = !tempDisplay['TeacherTimeTable'];
	this.setState({
		display: tempDisplay
	});

    }, 

    onToggleRoomTimeTableDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['RoomTimeTable'] = !tempDisplay['RoomTimeTable'];
	this.setState({
		display: tempDisplay
	});

    }, 

    onToggleTeachersTableDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['TeachersTable'] = !tempDisplay['TeachersTable'];
	this.setState({
		display: tempDisplay
	});

    }, 

    onToggleDataFormDisplay: function(){
	var tempDisplay = this.state.display;
	tempDisplay['DataForm'] = !tempDisplay['DataForm'];
	this.setState({
		display: tempDisplay
	});

    },


    onChangeClass: function(oldText, newText){
        var tempClasses = this.state.classes;
        for(var x in tempClasses){
            if(tempClasses[x].class == oldText){
                tempClasses[x].class = newText;
            }
        }
        this.setState({
            classes: tempClasses
        });
    },

    onDeleteClass: function(text){
        var tempClasses = this.state.classes;
        for(var x in tempClasses){
            if(tempClasses[x].class == text){
                tempClasses.splice(x, 1);
            }
        }
        this.setState({
            classes: tempClasses
        });
    },

    onDeleteRoom: function(text){
        var tempRooms = this.state.rooms;
        for(var x in tempRooms){
            if(tempRooms[x].room == text){
                tempRooms.splice(x, 1);
            }
        }
        this.setState({
            rooms: tempRooms
        });
    },

    onDeleteTime: function(time){
        var tempTimes = this.state.times;
        for(var x in tempTimes){
            if(tempTimes[x].start == time.start && tempTimes[x].end == time.end && tempTimes[x].days == time.days){
                tempTimes.splice(x, 1);
            }
        }
        this.setState({
            times: tempTimes
        });
    },

    onDeleteTeacher: function(text){
        var tempTeachers = this.state.teachers;
        for(var x in tempTeachers){
            if(tempTeachers[x].name == text){
                tempTeachers.splice(x, 1);
            }
        }
        this.setState({
            teachers: tempTeachers
        });
    },

    onChangeTeacher: function(oldText, newText){
        var tempTeachers = this.state.teachers;
        for(var x in tempTeachers){
            if(tempTeachers[x].name == oldText){
                tempTeachers[x].name = newText;
            }
        }
        this.setState({
            teachers: tempTeachers
        });
    },

    onCreateTeacher: function(teacherName){
        var tempTeachers = this.state.teachers,
            newTeacher = {name: teacherName};
	
	for(var x = 0; x < tempTeachers.length; x++){
		if(tempTeachers[x].name == teacherName){
			return false;
		}
	}

        tempTeachers.push(newTeacher);
        
        this.setState({
            teachers: tempTeachers
        });

	return true;
    },

    onCreateRoom: function(roomName){
        var tempRooms = this.state.rooms,
            newRoom = {room: roomName};
    	
	for(var x = 0; x < tempRooms.length; x++){
		if(tempRooms[x].room == roomName){
			return false;
		}
	}

        tempRooms.push(newRoom);
        
        this.setState({
            rooms: tempRooms
        });

	return true;
    },

    updateData: function(cb){
        $.ajax({
            type: 'POST',
            url: 'http://' + serverIP +'/update',
            data: {
                "classes": JSON.stringify(this.state.classes),
                "teachers": JSON.stringify(this.state.teachers),
                "rooms": JSON.stringify(this.state.rooms),
                "times": JSON.stringify(this.state.times)
            },
            success: function(response){
            }.bind(this),
            complete: function(response){
                cb && cb();
            }
        });
    },

    onCreateClass: function(className){
        var tempClasses = this.state.classes,
            newClass = {class: className};

	for(var x = 0; x < tempClasses.length; x++){
		if(tempClasses[x].class == className){
			return false;
		}
	}

        tempClasses.push(newClass);
        
        this.setState({
            classes: tempClasses
        });

	return true;
    },

    // This is disgusting and I apologize if you're reading this but I'm in too deep and this is due soon
    onCreateTime: function(time){
        var tempTimes = this.state.times;
        var shouldContinue = true;
	for(var x = 0; x < tempTimes.length; x++){
		if(tempTimes[x].start == time.start && tempTimes[x].end == time.end){
			shouldContinue = false;
			for(var y = 0; y < tempTimes[x].days.length; y++){
				if(time.days.indexOf(tempTimes[x].days[y]) == -1){
					shouldContinue = true;
				}
			}
		}
	}
	if(shouldContinue){
        	tempTimes.push(time);
        	
        	this.setState({
            		times: tempTimes
        	});
		return true;
	}
	return false;
    },

    onChangeRoom: function(oldText, newText){
        var tempRooms = this.state.rooms;
        for(var x in tempRooms){
            if(tempRooms[x].room == oldText){
                tempRooms[x].room = newText;
            }
        }
        this.setState({
            rooms: tempRooms
        });
    },

    onChangeTime: function(oldTime, newTime){
        var tempTimes = this.state.times;
        for(var x in tempTimes){
            if(tempTimes[x].start == oldTime.start && tempTimes[x].end == oldTime.end && tempTimes[x].days == oldTime.days){
                tempTimes[x] = newTime;
            }
        }
        this.setState({
            times: tempTimes
        });
    },

    onCreateTeacherConstraint: function(constraint){
        var currentTeacherConstraints = this.state.teacherConstraints;
        if(!(constraint.teacher in currentTeacherConstraints)){
            currentTeacherConstraints[constraint.teacher] = [];
        }
        currentTeacherConstraints[constraint.teacher].push(constraint._class);
        this.setState({
            teacherConstraints: currentTeacherConstraints
        });
    },

    onRemoveTeacherConstraint: function(teacher, _class){
        var temp = this.state.teacherConstraints;
        var currentConstraints = this.state.teacherConstraints[teacher];
        
        if(!currentConstraints){
            return;
        }

        var index = currentConstraints.indexOf(_class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }

        index = currentConstraints.indexOf("not " + _class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }
        temp[teacher] = currentConstraints;
        this.setState({teacherConstraints: temp});
    },
    
    onCreateRoomConstraint: function(constraint){
        var currentRoomConstraints = this.state.roomConstraints;
        if(!(constraint.room in currentRoomConstraints)){
            currentRoomConstraints[constraint.room] = [];
        }
        currentRoomConstraints[constraint.room].push(constraint._class);
        this.setState({
            roomConstraints: currentRoomConstraints
        });
    },

    onRemoveRoomConstraint: function(room, _class){
        var temp = this.state.roomConstraints;
        var currentConstraints = this.state.roomConstraints[room];
        
        if(!currentConstraints){
            return;
        }

        var index = currentConstraints.indexOf(_class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }

        index = currentConstraints.indexOf("not " + _class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }
        temp[room] = currentConstraints;
        this.setState({roomConstraints: temp});
    },

    onCreateRoomTimeConstraint: function(constraint){
        var currentRoomTimeConstraints = this.state.roomTimeConstraints;
        if(!(constraint.room in currentRoomTimeConstraints)){
            currentRoomTimeConstraints[constraint.room] = [];
        }
        currentRoomTimeConstraints[constraint.room].push(constraint.time);
        this.setState({
            roomTimeConstraints: currentRoomTimeConstraints
    	});
    },

    onRemoveRoomTimeConstraint: function(room, time){
        var temp = this.state.roomTimeConstraints;
        var currentConstraints = this.state.roomTimeConstraints[room];

        if(!currentConstraints){
            return;
        }

        var index = currentConstraints.indexOf(time);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }

        index = currentConstraints.indexOf("not " + time);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }
        temp[room] = currentConstraints;
        this.setState({roomTimeConstraints: temp});
    },

    onCreateTeacherTimeConstraint: function(constraint){
        var currentTeacherTimeConstraints = this.state.teacherTimeConstraints;
        if(!(constraint.teacher in currentTeacherTimeConstraints)){
            currentTeacherTimeConstraints[constraint.teacher] = [];
        }
        currentTeacherTimeConstraints[constraint.teacher].push(constraint.time);
        this.setState({
            teacherTimeConstraints: currentTeacherTimeConstraints
        });
    },

    onRemoveTeacherTimeConstraint: function(teacher, time){
        var temp = this.state.teacherTimeConstraints;
        var currentConstraints = this.state.teacherTimeConstraints[teacher];
        if(!currentConstraints){
            return;
        }

        var index = currentConstraints.indexOf(time);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }

        index = currentConstraints.indexOf("not " + time);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }
        temp[teacher] = currentConstraints;
        this.setState({teacherTimeConstraints: temp});
    },
    
    onCreateTimeConstraint: function(constraint){
        var currentTimeConstraints = this.state.timeConstraints;
        if(!(constraint.time in currentTimeConstraints)){
            currentTimeConstraints[constraint.time] = [];
        }
        currentTimeConstraints[constraint.time].push(constraint._class);
        this.setState({
            timeConstraints: currentTimeConstraints
        });
    },

    onRemoveTimeConstraint: function(time, _class){
        var temp = this.state.timeConstraints;
        var currentConstraints = this.state.timeConstraints[time];
        
        if(!currentConstraints){
            return;
        }

        var index = currentConstraints.indexOf(_class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }

        index = currentConstraints.indexOf("not " + _class);
        if(index > -1){
            currentConstraints.splice(index, 1);
        }
        temp[time] = currentConstraints;
        this.setState({timeConstraints: temp});
    },

    onGenerateSuccess: function(response){
        this.setState({
		error: null,
		scheduleItems: response.results
	});
	//this.setState({
        //    completedSchedule: schedule
        //})
    },

    onGenerateFailure: function(){
	this.setState({
		error: "No solution available",
		scheduleItems: null
	});
    },

    onGenerate: function(){
	var teachersXCourses = {};
	var coursesXRooms = {};
	var teachersXTimes = {};
	var roomsXTimes = {};
	var coursesXTimes = {};
	
	// teacher course constraints
	for(var a in this.state.teacherConstraints){
		teachersXCourses[a] = [];
		// go through course constraints for every teacher
		for(var b in this.state.teacherConstraints[a]){
			teachersXCourses[a].push(this.state.teacherConstraints[a][b]);
		}
	}

	// room course constraints
	for(var a in this.state.roomConstraints){
		coursesXRooms[a] = [];
		// go through course constraints for every room
		for(var b in this.state.roomConstraints[a]){
			coursesXRooms[a].push(this.state.roomConstraints[a][b]);
		}
	}
	
	// course time constrains
	for(var a in this.state.timeConstraints){
		coursesXTimes[a] = [];
		// go through time constraints for every course
		for(var b in this.state.timeConstraints[a]){
			coursesXTimes[a].push(this.state.timeConstraints[a][b]);
		}
	}

	// room time constraints
	for(var a in this.state.roomTimeConstraints){
		roomsXTimes[a] = [];
		// go through time constraints for every teacher
		for(var b in this.state.roomTimeConstraints[a]){
			roomsXTimes[a].push(this.state.roomTimeConstraints[a][b]);
		}
	}
	// teacher time constraints
	for(var a in this.state.teacherTimeConstraints){
		teachersXTimes[a] = [];
		// go through time constraints for every teacher
		for(var b in this.state.teacherTimeConstraints[a]){
			teachersXTimes[a].push(this.state.teacherTimeConstraints[a][b]);
		}
	}

        try{
	    this.setState({loading: true});
	    $.ajax({
            type: 'POST',
            url: 'http://' + serverIP + '/generate',
            data: {
                "teachers": JSON.stringify(this.state.teachers), 
                "classes": JSON.stringify(this.state.classes), 
                "rooms": JSON.stringify(this.state.rooms), 
                "times": JSON.stringify(this.state.times),
		"teachersNumCourses": JSON.stringify(this.state.teacherCounts),
		"teachersXcourses": JSON.stringify(teachersXCourses),
		"coursesXrooms": JSON.stringify(coursesXRooms),
		"teachersXtimes": JSON.stringify(teachersXTimes),
		"roomsXtimes": JSON.stringify(roomsXTimes),
		"coursesXtimes": JSON.stringify(coursesXTimes)
            },
            success: function(response){
		this.setState({loading: false});
                this.onGenerateSuccess(JSON.parse(response));
            }.bind(this),
	    error: function(error){
		this.setState({loading: false});
		this.onGenerateFailure();
	    }.bind(this),
	    });
	} catch(error){console.log(error); this.onGenerateFailure()};

    },

    onSaveChanges: function(){
        this.updateData(function(){
            window.location.reload();
        });
    },

    onTeacherCountChange: function(teacher, val){
	var tempCounts = this.state.teacherCounts;
	tempCounts[teacher] = Number(val);
	this.setState({teacherCounts: tempCounts});
    },
    
    render: function(){
        if(!this.state.teachers || !this.state.rooms || !this.state.classes || !this.state.times || !this.state.teacherCounts){
            return <div>Loading...</div>
        }
        var schedule;
        if(this.state.completedSchedule){
            schedule = <ScheduleTable schedule={this.state.completedSchedule} teachers={this.state.teachers} classes={this.state.classes} />
        }
	if(this.state.scheduleItems){
		var listItems = this.state.scheduleItems.map(function(item){
			// This is embarrassing and I'm mad at myself for doing it
			var niceTime, roomText;
			var firstHour = item.time.substring(0, 2);
			var firstMins = item.time.substring(2, 4);
			var secondHour = item.time.substring(4, 6);
			var secondMins = item.time.substring(6, 8);
			var days = item.time.substring(8, item.time.length);
			niceTime = firstHour + ":" + firstMins + " - " + secondHour + ":" + secondMins + " " + days;
			// remove class info from "other" room variables, just show as "other"
			if(item.room.substring(0, 5) == "other"){
				roomText = "Other";
			}
			else{
				roomText = item.room;
			}
			return <li key={item.course + item.time}>{item.course} - {roomText} - {item.teacher} - {niceTime}</li>
		});
		schedule = <ul>{listItems}</ul>;
	}
	else if(this.state.error){
		schedule = <h4 className="error">{"Error: No possible solutions"}</h4>;
	}
	if(this.state.loading){
		schedule = <h4>{"Loading..."}</h4>;
	}
        return (
            <div>
                <div>
                    <DataForm 
			display={this.state.display.DataForm}
			onToggle={this.onToggleDataFormDisplay} 
                        teachers={this.state.teachers} 
                        times={this.state.times} 
                        rooms={this.state.rooms} 
                        classes={this.state.classes} 
                        onChangeClass={this.onChangeClass}
                        onChangeTime={this.onChangeTime}
                        onChangeRoom={this.onChangeRoom}
                        onChangeTeacher={this.onChangeTeacher}
                        onCreateTeacher={this.onCreateTeacher}
                        onCreateRoom={this.onCreateRoom}
                        onCreateTime={this.onCreateTime}
                        onCreateClass={this.onCreateClass}
                        onDeleteTeacher={this.onDeleteTeacher}
                        onDeleteTime={this.onDeleteTime}
                        onDeleteRoom={this.onDeleteRoom}
                        onDeleteClass={this.onDeleteClass}
                        onSaveChanges={this.onSaveChanges}
                    />
                    <TeachersTable 
			onToggle={this.onToggleTeachersTableDisplay} 
			updateTeacherCounts={this.updateTeacherCounts}
			display={this.state.display.TeachersTable} 
			onCreate={this.onCreateTeacherConstraint} 
			onRemove={this.onRemoveTeacherConstraint} 
			classes={this.state.classes} 
			teachers={this.state.teachers} 
		    />
                    <RoomsTable 
			onToggle={this.onToggleRoomsTableDisplay} 
			display={this.state.display.RoomsTable} 
			onCreate={this.onCreateRoomConstraint} 
			onRemove={this.onRemoveRoomConstraint} 
			classes={this.state.classes} 
			rooms={this.state.rooms} 
		    />
                    <TimesTable 
			onToggle={this.onToggleTimesTableDisplay} 
			display={this.state.display.TimesTable}
			onCreate={this.onCreateTimeConstraint} 
			onRemove={this.onRemoveTimeConstraint} 
			classes={this.state.classes} 
			times={this.state.times} 
		    />
                    <TeacherTimeTable 
			onToggle={this.onToggleTeacherTimeTableDisplay} 
			display={this.state.display.TeacherTimeTable} 
			onCreate={this.onCreateTeacherTimeConstraint} 
			onRemove={this.onRemoveTeacherTimeConstraint} 
			teachers={this.state.teachers} 
			times={this.state.times} 
		    />
                    <RoomTimeTable 
			onToggle={this.onToggleRoomTimeTableDisplay} 
			display={this.state.display.RoomTimeTable} 
			onCreate={this.onCreateRoomTimeConstraint} 
			onRemove={this.onRemoveRoomTimeConstraint} 
			rooms={this.state.rooms} 
			times={this.state.times} 
		    />
                    <TeacherCountTable 
			onToggle={this.onToggleTeacherCountTableDisplay} 
			display={this.state.display.TeacherCountTable} 
			counts={this.state.teacherCounts} 
			onChange={this.onTeacherCountChange} 
			teachers={this.state.teachers} 
		    />
                </div>
                <div>
                    <button onClick={this.onGenerate} type="button" className="btn btn-success">Generate Schedule</button>
                </div>
		<div className="results">
                {schedule}
		</div>
            </div>
        );
    }
});

export default MasterComponent;
