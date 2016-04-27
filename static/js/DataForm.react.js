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
		if(this.props.onCreateTeacher(this.state.teacherAdd)){
			this.onEdit();
			this.setState({
				teacherAdd: ""
			});
		}
		else{
			this.setState({
				teacherDupeText: <span className="text-danger">{this.state.teacherAdd + " already exists"}</span>
			});
			setTimeout(function(){
				this.setState({
					teacherDupeText: null
				});
			}.bind(this), 3000);
		}
	},

	onCancelCreateTeacher: function(){
		this.setState({
			teacherAdd: "",
			showTeacherAdd: false
		});
	},


	onCreateRoom: function(){
		if(this.props.onCreateRoom(this.state.roomAdd)){
			this.onEdit();
			this.setState({
				roomAdd: ""
			});
		}
		else{
			this.setState({
				roomDupeText: <span className="text-danger">{this.state.roomAdd + " already exists"}</span>
			});
			setTimeout(function(){
				this.setState({
					roomDupeText: null
				});
			}.bind(this), 3000);
		}
	},

	onCancelCreateRoom: function(){
		this.setState({
			roomAdd: "",
			showRoomAdd: false
		});
	},

	onCreateTime: function(time){
		if(this.props.onCreateTime(time)){
			this.onEdit();
			this.setState({
				timeAdd: ""
			});
			return true;
		}
		else{
			this.setState({
				timeDupeText: <span className="text-danger">{"Time already exists"}</span>
			});
			setTimeout(function(){
				this.setState({
					timeDupeText: null
				});
			}.bind(this), 3000);
			return false;
		}
	},
	
	onCancelCreateTime: function(){
		this.setState({
			showTimeAdd: false
		});
	},

	onCreateClass: function(){
		if(this.props.onCreateClass(this.state.classAdd)){
			this.onEdit();
			this.setState({
				classAdd: ""
			});
		}

		else{
			this.setState({
				classDupeText: <span className="text-danger">{"Class " + this.state.classAdd + " already exists"}</span>
			});
			setTimeout(function(){
				this.setState({
					classDupeText: null
				});
			}.bind(this), 3000);
		}
	},

	onCancelCreateClass: function(){
		this.setState({
			classAdd: "",
			showClassAdd: false
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
		this.setState({
			showResetConfirm: true
		});	
	},
	
	onCancelReset: function(){
		this.setState({
			showResetConfirm: false
		});
	},

	onConfirmResetData: function(){
	    $.ajax({
                type: 'POST',
                url: 'http://' + serverIP +'/reset',
                success: function(response){
			window.location.reload();//this.props.onSaveChanges();
                }.bind(this),
                
            });

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
		var saveChangesButton;
		var confirmContent;
		if(this.state.showResetConfirm){
			confirmContent = <div className="confirm"><strong>Are you sure?</strong> <span className="link" onClick={this.onConfirmResetData}>Yes</span> <span className="link" onClick={this.onCancelReset}>No</span></div>;
		}
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

		var classAddContent = <li><input type="text" onChange={this.onClassAdd} value={this.state.classAdd}/><br /><div className="btn btn-default" onClick={this.onCreateClass}>Add</div><div className="btn btn-default" onClick={this.onCancelCreateClass}>Cancel</div><br />{this.state.classDupeText}</li>;
		if(!this.state.showClassAdd){
			classAddContent = <li className="list-add" onClick={this.onShowClassAdd}><strong>{"Add a class..."}</strong></li>;
		}
		var roomAddContent = <li><input type="text" onChange={this.onRoomAdd} value={this.state.roomAdd}/><br /><div className="btn btn-default" onClick={this.onCreateRoom}>Add</div><div className="btn btn-default" onClick={this.onCancelCreateRoom}>Cancel</div><br />{this.state.roomDupeText}</li>;
		if(!this.state.showRoomAdd){
			roomAddContent = <li className="list-add" onClick={this.onShowRoomAdd}><strong>{"Add a room..."}</strong></li>;
		}

		var teacherAddContent = <li><input type="text" onChange={this.onTeacherAdd} value={this.state.teacherAdd}/><br /><div className="btn btn-default" onClick={this.onCreateTeacher}>Add</div><div className="btn btn-default" onClick={this.onCancelCreateTeacher}>Cancel</div><br />{this.state.teacherDupeText}</li>;
		if(!this.state.showTeacherAdd){
			teacherAddContent = <li className="list-add" onClick={this.onShowTeacherAdd}><strong>{"Add a teacher..."}</strong></li>;
		}
		var timeAddContent = <TimeEditBox onEdit={this.onEdit} add={true} onCancel={this.onCancelCreateTime} onAdd={this.onCreateTime} dupeText={this.state.timeDupeText} time={{}}/>;
		if(!this.state.showTimeAdd){
			timeAddContent = <li className="list-add" onClick={this.onShowTimeAdd}><strong>{"Add a time..."}</strong></li>;
		}

		var data;
		var glyphicon = <strong>{"+"}</strong>//<span className="glyphicon glyphicon-plus" />;

		if(this.props.display){
			glyphicon = <strong>{"-"}</strong>;
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
				{confirmContent}
				</div>
				</div>
			);
		}

		if(!this.state.hover){
			glyphicon = null;
		}

		return (
			<div>
				<h4 onMouseOver={this.onHover} onMouseOut={this.offHover} className="toggle" onClick={this.props.onToggle}>Data {glyphicon}</h4>
				{data}			
			</div>
		);
	}
});

export default DataForm;
