import DataCell from './DataCell.react.js';
import React from 'react';

var TeacherCountTable = React.createClass({
    getInitialState: function(){
        return{
            teacherCounts: this.props.counts
        }
    },

    handleChange: function(teacher, val){
	this.props.onChange(teacher, val);
        //var currentCounts = this.state.teacherCounts;
        //currentCounts[teacher] = val;
        //this.setState({
        //    teacherCounts: currentCounts
        //});
    },

    render: function(){
        var rows = this.props.teachers.map(function(teacher){
            var handleChange = function(e){
                this.handleChange(teacher.name, e.target.value)
            }.bind(this);
            return (
                <tr key={teacher.name}>
                    <td>{teacher.name}</td>
                    <td>
                        <input type="number" onChange={handleChange} value={this.state.teacherCounts[teacher.name]} />
                    </td>
                </tr>
            );
        }.bind(this));
        return (
            <table id="teacher-count-table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

export default TeacherCountTable;
