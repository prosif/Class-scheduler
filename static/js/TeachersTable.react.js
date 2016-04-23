import DataCell from './DataCell.react.js';
import React from 'react';

var TeachersTable = React.createClass({
    getInitialState: function(){
        return({
            teachers: this.props.teachers,
            classes: this.props.classes,
            teacherStatuses: {},
            teacherCounts: {},
            classCounts: {}
        });
    },

    onTeacherClick: function(_class, teacher){
        var currentStatus = this.state.teacherStatuses[teacher.name + _class.class],
            valToAdd = 0,
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                valToAdd = 1;
                constraint = {teacher: teacher.name, _class: _class.class}
                break;
            case "yes":
                currentStatus = "no";
                valToAdd = -1;
                var constraint = {teacher: teacher.name, _class: "not " + _class.class}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.teacherStatuses;
        var newTeacherCount = this.state.teacherCounts;
        var newClassCount = this.state.classCounts;
        newTeacherCount[teacher.name] += valToAdd;
        newClassCount[_class.class] += valToAdd;
        temp[teacher.name + _class.class] = currentStatus;
        this.setState({
            teacherStatuses: temp,
            teacherCounts: newTeacherCount,
            classCounts: newClassCount
        });

        this.props.onRemove(teacher.name, _class.class);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {},
            tempClassCounts = {},
            tempTeacherCounts = {};

        this.props.teachers.map(function(teacher){
            if(!(teacher.name in tempTeacherCounts)){
                tempTeacherCounts[teacher.name] = 0;
            }
            this.props.classes.map(function(_class){
                if(!(teacher.name + _class.class in temp)){
                    temp[teacher.name + _class.class] = null;
                }
                if(!(_class.class in tempClassCounts)){
                    tempClassCounts[_class.class] = 0;
                }
            }.bind(this));
        }.bind(this));

        this.setState({
            teacherStatuses: temp, 
            classCounts: tempClassCounts, 
            teacherCounts: tempTeacherCounts
        });
    },

    render: function(){

        var teacherHeaders = this.props.teachers.map(function(teacher){
            return (
                <th scope="col" key={teacher.name}>
                    {teacher.name}
                </th>
            );
        });

        teacherHeaders.unshift(<th key="empty"></th>);
        teacherHeaders.push(<th key="total">Total</th>);

        var classRows = this.props.classes.map(function(_class){
            var tableCells = this.props.teachers.map(function(teacher){
                var roomClick = function(){
                    this.onTeacherClick(_class, teacher);
                }.bind(this);
                return (
                    <DataCell status={this.state.teacherStatuses[teacher.name + _class.class]} onClick={roomClick} key={_class.class + teacher.name} />
                );                        
            }.bind(this));
            return (
                <tr key={_class.class}>
                    <th scope="row">{_class.class}</th>
                    {tableCells}
                    <td>
                        {this.state.classCounts[_class.class]}
                    </td>
                </tr>
            );
        }.bind(this));

        var teacherCountCells = this.props.teachers.map(function(teacher){
            return <td key={teacher.name}>{this.state.teacherCounts[teacher.name]}</td>
        }.bind(this));

        teacherCountCells.unshift(<th scope="row" key="total">Total</th>);

        return(
            <table id="teachers-table">
                <thead>
                    <tr>{teacherHeaders}</tr>
                </thead>
                <tbody>
                    {classRows}
                    <tr>
                        {teacherCountCells}
                    </tr>
                </tbody>
            </table>
        );
    }
});

export default TeachersTable;
