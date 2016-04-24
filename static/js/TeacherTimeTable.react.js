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
        var currentStatus = this.state.timeStatuses[teacher.name + time.start + time.end],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {teacher: teacher.name, time: time.start + time.end}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {teacher: teacher.name, time: "not " + time.start + time.end}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.timeStatuses;
        temp[teacher.name + time.start + time.end] = currentStatus;
        this.setState({timeStatuses: temp});

        this.props.onRemove(teacher.name, time.start + time.end);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.teachers.map(function(teacher){
                if(!(teacher.name + time.start + time.end in temp)){
                    temp[teacher.name + time.start + time.end] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({timeStatuses: temp});
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
                return (
                    <DataCell status={this.state.timeStatuses[teacher.name + time.start + time.end]} onClick={timeClick} key={teacher.name + time.start + time.end} />
                );                        
            }.bind(this));
            return (
                <tr key={teacher.name}>
                    <th scope="row">{teacher.name}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

        return(
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
});

export default TeacherTimeTable;
