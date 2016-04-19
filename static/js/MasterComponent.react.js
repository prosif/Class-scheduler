import RoomsTable from './RoomsTable.react.js';
import ScheduleTable from './ScheduleTable.react.js';
import TeacherCountTable from './TeacherCountTable.react.js';
import TeacherTimeTable from './TeacherTimeTable.react.js';
import RoomTimeTable from './RoomTimeTable.react.js';
import TeachersTable from './TeachersTable.react.js';
import TimesTable from './TimesTable.react.js';
import DataForm from './DataForm.react.js';

var MasterComponent = React.createClass({
    getInitialState: function(){
        return({
            teacherConstraints: {},
            roomConstraints: {},
            timeConstraints: {},
            teacherTimeConstraints: {},
            roomTimeConstraints: {}
        });
    },

    componentDidMount: function(){
        $.ajax({
            type: 'GET',
            url: 'http://192.168.56.101/data',
            success: function(response){
                var parsed = JSON.parse(response);
                this.setState({
                    teachers: parsed.teachers,
                    classes: parsed.classes,
                    times: parsed.times,
                    rooms: parsed.rooms
                })
            }.bind(this),
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

    onDeleteTime: function(text){
        var tempTimes = this.state.times;
        for(var x in tempTimes){
            if(tempTimes[x].start_time + tempTimes[x].end_time == text){
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
        tempTeachers.push(newTeacher);
        
        this.setState({
            teachers: tempTeachers
        });
    },

    onCreateRoom: function(roomName){
        var tempRooms = this.state.rooms,
            newRoom = {room: roomName};
        tempRooms.push(newRoom);
        
        this.setState({
            rooms: tempRooms
        });
    },

    updateData: function(cb){
        $.ajax({
            type: 'POST',
            url: 'http://192.168.56.101/update',
            data: {
                "classes": JSON.stringify(this.state.classes),
                "teachers": JSON.stringify(this.state.teachers),
                "rooms": JSON.stringify(this.state.rooms),
                "times": JSON.stringify(this.state.times)
            },
            success: function(response){
                console.log(response);
            }.bind(this),
            complete: function(response){
                cb && cb();
            }
        });
    },

    onCreateClass: function(className){
        var tempClasses = this.state.classes,
            newClass = {class: className};
        tempClasses.push(newClass);
        
        this.setState({
            classes: tempClasses
        });
    },

    onCreateTime: function(timeName){
        var tempTimes = this.state.times,
            newTime = {start_time: timeName, end_time: timeName, days: ["Mon", "Tue", "Wed"]};
        tempTimes.push(newTime);
        
        this.setState({
            times: tempTimes
        });
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

    onChangeTime: function(oldText, newText){
        var tempTimes = this.state.times;
        for(var x in tempTimes){
            if(tempTimes[x].time == oldText){
                tempTimes[x].time = newText;
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

    onRemoveRoomTimeConstraint: function(time, room){
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
        this.setState({timeConstraints: temp});
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

    onGenerateSuccess: function(schedule){
        this.setState({
            completedSchedule: schedule
        })
    },

    onGenerate: function(){
	var teachersNumCourses = {};
	var teachersXCourses = {};
	var coursesXRooms = {};
	var teachersXTimes = {};
	
	console.log(this.state);
	
	for(var x in this.state.teachers){
		teachersNumCourses[this.state.teachers[x].name] = 0;
	}
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

	// teacher time constraints
	for(var a in this.state.roomConstraints){
		coursesXRooms[a] = [];
		// go through course constraints for every room
		for(var b in this.state.roomConstraints[a]){
			coursesXRooms[a].push(this.state.roomConstraints[a][b]);
		}
	}

        $.ajax({
            type: 'POST',
            url: 'http://192.168.56.101/generate',
            data: {
                "teachers": JSON.stringify(this.state.teachers), 
                "classes": JSON.stringify(this.state.classes), 
                "rooms": JSON.stringify(this.state.rooms), 
                "times": JSON.stringify(this.state.times),
		"teachersNumCourses": JSON.stringify(teachersNumCourses),
		"teachersXcourses": JSON.stringify(teachersXCourses),
		"coursesXrooms": JSON.stringify(coursesXRooms),
		"teachersXtimes": JSON.stringify(teachersXTimes)
            },
            success: function(response){
                this.onGenerateSuccess(JSON.parse(response));
            }.bind(this),
        });

    },

    onSaveChanges: function(){
        this.updateData(function(){
            window.location.reload();
        });
    },
    
    render: function(){
        if(!this.state.teachers || !this.state.rooms || !this.state.classes || !this.state.times){
            return <div>Loading...</div>
        }
        var schedule;
        if(this.state.completedSchedule){
            schedule = <ScheduleTable schedule={this.state.completedSchedule} teachers={this.state.teachers} classes={this.state.classes} />
        }
        return (
            <div>
                <div>
                    <DataForm 
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
                    <TeachersTable onCreate={this.onCreateTeacherConstraint} onRemove={this.onRemoveTeacherConstraint} classes={this.state.classes} teachers={this.state.teachers} />
                    <RoomsTable onCreate={this.onCreateRoomConstraint} onRemove={this.onRemoveRoomConstraint} classes={this.state.classes} rooms={this.state.rooms} />
                    <TimesTable onCreate={this.onCreateTimeConstraint} onRemove={this.onRemoveTimeConstraint} classes={this.state.classes} times={this.state.times} />
                    <TeacherTimeTable onCreate={this.onCreateTeacherTimeConstraint} onRemove={this.onRemoveTeacherTimeConstraint} teachers={this.state.teachers} times={this.state.times} />
                    <RoomTimeTable onCreate={this.onCreateRoomTimeConstraint} onRemove={this.onRemoveRoomTimeConstraint} rooms={this.state.rooms} times={this.state.times} />
                    <TeacherCountTable teachers={this.state.teachers} />
                </div>
                <div>
                    <button onClick={this.onGenerate} type="button" className="btn btn-primary">Generate Schedule</button>
                </div>
                {schedule}
            </div>
        );
    }
});

export default MasterComponent;
