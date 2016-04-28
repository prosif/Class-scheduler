import DataCell from './DataCell.react.js';
import React from 'react';

var TeacherTimeTable = React.createClass({
    getInitialState: function(){
        return({
            teachers: this.props.teachers,
            times: this.props.times,
            timeStatuses: {}
        });
    },

    onTimeClick: function(teacher, time){
	console.log("Clicked!");
	var daysString = "";
	for(var x in time.days){
		daysString += time.days[x];
	}
        var currentStatus = this.state.timeStatuses[teacher.name + time.start + time.end + daysString],
            constraint;

        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {teacher: teacher.name, time: time.start + time.end + daysString}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {teacher: teacher.name, time: "not " + time.start + time.end + daysString}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.timeStatuses;
        temp[teacher.name + time.start + time.end + daysString] = currentStatus;
        this.setState({timeStatuses: temp});

        this.props.onRemove(teacher.name, time.start + time.end + daysString);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.teachers.map(function(teacher){
		var daysString = "";
		for(var x in time.days){
			daysString += time.days[x];
		}
                if(!(teacher.name + time.start + time.end in temp)){
                    temp[teacher.name + time.start + time.end + daysString] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({timeStatuses: temp});
    },
  
    onHover: function(){
	this.setState({
	    hover: true
	});
    },

    offHover: function(){
	this.setState({
	    hover: false
	});
    },

    render: function(){
        var timeHeaders = this.props.times.map(function(time){
            return (
                <th scope="col" key={time.start + time.end}>
                    {time.start + " - " + time.end + " " + time.days}
                </th>
            );
        });

        timeHeaders.unshift(<th key="empty"></th>);

        var teacherHeaders = this.props.teachers.map(function(teacher){
            var tableCells = this.props.times.map(function(time){
                var timeClick = function(){
                    this.onTimeClick(teacher, time);
                }.bind(this);
		var daysString = "";
		for(var x in time.days){
			daysString += time.days[x];
		}
                return (
                    <DataCell status={this.state.timeStatuses[teacher.name + time.start + time.end + daysString]} onClick={timeClick} key={teacher.name + time.start + time.end} />
                );                        
            }.bind(this));
            return (
                <tr key={teacher.name}>
                    <th scope="row">{teacher.name}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

	var content;
	var glyphicon = <strong>{"+"}</strong>;
	if(this.props.display){
	    glyphicon = <strong>{"-"}</strong>;
	    content =(
	        <table id="teacher-time-table">
                    <thead>
                        <tr>{timeHeaders}</tr>
                    </thead>
                    <tbody>
                        {teacherHeaders}
                    </tbody>
                </table>
	    );
	}

	if(!this.state.hover){
		glyphicon = null;
	}

        return(
		<div>
			<h4 className="toggle" onMouseOver={this.onHover} onMouseOut={this.offHover} onClick={this.props.onToggle}>Teacher - Time Constraints {glyphicon}</h4>
			{content}
		</div>
        );
    }
});

export default TeacherTimeTable;
