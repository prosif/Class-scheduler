import EditBox from './EditBox.react.js';
import TimeEditBox from './TimeEditBox.react.js';
import React from 'react';
import $ from 'jquery';

var DataForm = React.createClass({
        displayName: "DataForm",

	getInitialState: function(){
		return{
			teacherAdd: "",
			roomAdd: "",
			classAdd: "",
			timeAdd: ""
		}
	},

	onChangeTime: function(oldText, newText){
		this.props.onChangeTime(oldText, newText);
	},

	onChangeRoom: function(oldText, newText){
		this.props.onChangeRoom(oldText, newText);
	},

	onChangeClass: function(oldText, newText){
		this.props.onChangeClass(oldText, newText);
	},

	onChangeTeacher: function(oldText, newText){
		this.props.onChangeTeacher(oldText, newText);
	},

	onDeleteClass: function(text){
		this.props.onDeleteClass(text);
	},

	onDeleteTeacher: function(text){
		this.props.onDeleteTeacher(text);
	},

	onDeleteRoom: function(text){
		this.props.onDeleteRoom(text);
	},

	onDeleteTime: function(time){
		this.props.onDeleteTime(time);
	},

	onTeacherAdd: function(e){
		this.setState({
			teacherAdd: e.target.value
		});
	},

	onTimeAdd: function(e){
		this.setState({
			timeAdd: e.target.value
		});
	},

	onClassAdd: function(e){
		this.setState({
			classAdd: e.target.value
		});
	},

	onRoomAdd: function(e){
		this.setState({
			roomAdd: e.target.value
		});
	},

	onEdit: function(){
		this.setState({
			changed: true
		});
	},

	onCreateTeacher: function(){
		this.onEdit();
		this.props.onCreateTeacher(this.state.teacherAdd);
		this.setState({
			teacherAdd: ""
		});
	},

	onCreateRoom: function(){
		this.onEdit();
		this.props.onCreateRoom(this.state.roomAdd);
		this.setState({
			roomAdd: ""
		});
	},

	onCreateTime: function(time){
		this.onEdit();
		this.props.onCreateTime(time);
		this.setState({
			timeAdd: ""
		});
	},

	onCreateClass: function(){
		this.onEdit();
		this.props.onCreateClass(this.state.classAdd);
		this.setState({
			classAdd: ""
		});
	},

	onSaveChanges: function(){
		this.props.onSaveChanges();
	},

	onShowClassAdd: function(){
		this.setState({
			showClassAdd: true
		});
	},

	onShowRoomAdd: function(){
		this.setState({
			showRoomAdd: true
		});
	},

	onShowTeacherAdd: function(){
		this.setState({
			showTeacherAdd: true
		});
	},

	onShowTimeAdd: function(){
		this.setState({
			showTimeAdd: true
		});
	},

	onResetData: function(){
	    $.ajax({
                type: 'POST',
                url: 'http://' + serverIP +'/reset',
                success: function(response){
			window.location.reload();//this.props.onSaveChanges();
                }.bind(this),
                
            });
	},

	render: function(){
		var saveChangesButton;
		if(this.state.changed){
			saveChangesButton = <div className="confirm-changes btn btn-success" onClick={this.onSaveChanges}>Save changes</div>;
		}
		var classesList = this.props.classes.map(function(_class){
			return <EditBox onEdit={this.onEdit} onDelete={this.onDeleteClass} onConfirm={this.onChangeClass} key={_class.class} content={_class.class} />;
		}.bind(this));

		var timesList = this.props.times.map(function(time){
			return <TimeEditBox onEdit={this.onEdit} onDelete={this.onDeleteTime} onConfirm={this.onChangeTime} key={time.start + time.end} time={time} />;
		}.bind(this));

		var roomsList = this.props.rooms.map(function(room){
			return <EditBox onEdit={this.onEdit} onDelete={this.onDeleteRoom} onConfirm={this.onChangeRoom} key={room.room} content={room.room} />;
		}.bind(this));

		var teachersList = this.props.teachers.map(function(teacher){
			return <EditBox onEdit={this.onEdit} onDelete={this.onDeleteTeacher} onConfirm={this.onChangeTeacher} key={teacher.name} content={teacher.name} />;
		}.bind(this));

		var classAddContent = <li><input type="text" onChange={this.onClassAdd} value={this.state.classAdd}/><div className="btn btn-default" onClick={this.onCreateClass}>Add</div></li>;
		if(!this.state.showClassAdd){
			classAddContent = <li className="list-add" onClick={this.onShowClassAdd}>{"Add a class..."}</li>;
		}
		var roomAddContent = <li><input type="text" onChange={this.onRoomAdd} value={this.state.roomAdd}/><div className="btn btn-default" onClick={this.onCreateRoom}>Add</div></li>;
		if(!this.state.showRoomAdd){
			roomAddContent = <li className="list-add" onClick={this.onShowRoomAdd}>{"Add a room..."}</li>;
		}

		var teacherAddContent = <li><input type="text" onChange={this.onTeacherAdd} value={this.state.teacherAdd}/><div className="btn btn-default" onClick={this.onCreateTeacher}>Add</div></li>;
		if(!this.state.showTeacherAdd){
			teacherAddContent = <li onClick={this.onShowTeacherAdd}>{"Add a teacher..."}</li>;
		}
		var timeAddContent = <TimeEditBox onEdit={this.onEdit} add={true} onAdd={this.onCreateTime} time={{}}/>;
		if(!this.state.showTimeAdd){
			timeAddContent = <li onClick={this.onShowTimeAdd}>{"Add a time..."}</li>;
		}

		var data;

		if(this.props.display){
			data = (
				<div>
				<div id="data-lists">
					<ul className="input">
						<lh><strong>Classes</strong></lh>
						{classesList}
						{classAddContent}
					</ul>
					<ul className="input">
						<lh><strong>Times</strong></lh>
						{timesList}
						{timeAddContent}
					</ul>
					<ul className="input">
						<lh><strong>Rooms</strong></lh>
						{roomsList}
						{roomAddContent}
					</ul>
					<ul className="input">
						<lh><strong>Teachers</strong></lh>
						{teachersList}
						{teacherAddContent}
					</ul>
				</div>
				<div className="buttons">
				{saveChangesButton}
				<div className="btn btn-danger reset-data" onClick={this.onResetData}>Reset all data</div>
				</div>
				</div>
			);
		}

		return (
			<div>
				<h4 onClick={this.props.onToggle}>Data</h4>
				{data}			
			</div>
		);
	}
});

export default DataForm;
