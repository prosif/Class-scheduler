import RoomsTable from './RoomsTable.react.js';
import ScheduleTable from './ScheduleTable.react.js';
import TeacherCountTable from './TeacherCountTable.react.js';
import TeachersTable from './TeachersTable.react.js';
import TimesTable from './TimesTable.react.js';

var MasterComponent = React.createClass({
    getInitialState: function(){
        return({
            teacherConstraints: {},
            roomConstraints: {},
            timeConstraints: {},
        });
    },

    componentDidMount: function(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/data',
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
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/generate',
            data: {
                "teachers": JSON.stringify(this.state.teachers), 
                "classes": JSON.stringify(this.state.classes), 
                "rooms": JSON.stringify(this.state.rooms), 
                "times": JSON.stringify(this.state.times)
            },
            success: function(response){
                this.onGenerateSuccess(JSON.parse(response));
            }.bind(this),
        });

    },
    
    render: function(){
        if(!this.state.teachers || !this.state.rooms || !this.state.classes || !this.state.times){
            return <div>Loading</div>
        }
        var schedule;
        if(this.state.completedSchedule){
            schedule = <ScheduleTable schedule={this.state.completedSchedule} teachers={this.state.teachers} classes={this.state.classes} />
        }
        return (
            <div>
                <div>
                    <TeachersTable onCreate={this.onCreateTeacherConstraint} onRemove={this.onRemoveTeacherConstraint} classes={this.state.classes} teachers={this.state.teachers} />
                    <RoomsTable onCreate={this.onCreateRoomConstraint} onRemove={this.onRemoveRoomConstraint} classes={this.state.classes} rooms={this.state.rooms} />
                    <TimesTable onCreate={this.onCreateTimeConstraint} onRemove={this.onRemoveTimeConstraint} classes={this.state.classes} times={this.state.times} />
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