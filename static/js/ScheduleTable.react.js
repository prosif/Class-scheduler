import React from 'react';

var ScheduleTable = React.createClass({
    displayName: "ScheduleTable",

    render: function(){                    
        var teacherHeaders = this.props.teachers.map(function(teacher){
            return (
                <th scope="col" key={teacher.name}>
                    {teacher.name}
                </th>
            );
        });

        teacherHeaders.unshift(<th key="empty"></th>);

        var classRows = this.props.classes.map(function(_class){
            var tableCells = this.props.teachers.map(function(teacher){
                var content = "-";
                var className = _class.class
                if(this.props.schedule[className].teacher == teacher.name){
                    content = <span className = "glyphicon glyphicon-ok" />;
                }
                return (
                    <td key={teacher.name}>{content}</td>
                );                        
            }.bind(this));
            return (
                <tr key={_class.class}>
                    <th scope="row">{_class.class}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

        return(
            <table id="schedule-table">
                <thead>
                    <tr>{teacherHeaders}</tr>
                </thead>
                <tbody>
                    {classRows}
                </tbody>
            </table>
        );
    }
});

export default ScheduleTable;
