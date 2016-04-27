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
	if(!this.props.counts){return <div>Loading...</div>;}
        var rows = this.props.teachers.map(function(teacher){
            var handleChange = function(e){
                this.handleChange(teacher.name, e.target.value)
            }.bind(this);
            return (
                <tr key={teacher.name}>
                    <td>{teacher.name}</td>
                    <td>
                        <input type="number" onChange={handleChange} value={this.props.counts[teacher.name]} />
                    courses
 	            </td>
                </tr>
            );
        }.bind(this));

        rows.unshift(
		<tr key="empty">
			<th>Teacher</th>
			<th>Must teach no more than</th>
		</tr>
	);

	var content;
	var glyphicon = <strong>{"+"}</strong>;
	if(this.props.display){
	    glyphicon = <strong>{"-"}</strong>;
	    content = (
                <table id="teacher-count-table">
                    <tbody>
                        {rows}
                    </tbody>
                </table>
  	    );
	}

	if(!this.state.hover){
		glyphicon = null;
	}

        return (
	    <div>
	        <h4 className="toggle" onMouseOver={this.onHover} onMouseOut={this.offHover} onClick={this.props.onToggle}>Teacher Course Count Constraints {glyphicon}</h4>
		{content}
	    </div>
        );
    }
});

export default TeacherCountTable;
