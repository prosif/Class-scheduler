import EditBox from './EditBox.react.js';

var DataForm = React.createClass({
	onChangeTime: function(newText){
		console.log("Going to save thing as", newText);
	},

	onChangeRoom: function(newText){
		console.log("Going to save thing as", newText);
	},

	onChangeClass: function(newText){
		console.log("Going to save thing as", newText);
	},

	onChangeTeacher: function(newText){
		console.log("Going to save thing as", newText);
	},

	render: function(){
		var classesList = this.props.classes.map(function(_class){
			return <EditBox onConfirm={this.onChangeClass} key={_class.class} content={_class.class} />;
		}.bind(this));

		var timesList = this.props.times.map(function(time){
			return <EditBox onConfirm={this.onChangeTime} key={time.time} content={time.time} />;
		}.bind(this));

		var roomsList = this.props.rooms.map(function(room){
			return <EditBox onConfirm={this.onChangeRoom} key={room.room} content={room.room} />;
		}.bind(this));

		var teachersList = this.props.teachers.map(function(teacher){
			return <EditBox onConfirm={this.onChangeTeacher} key={teacher.name} content={teacher.name} />;
		}.bind(this));

		return (
			<div>
				<div>
					<ul>
						{classesList}
					</ul>
					<ul>
						{timesList}
					</ul>
					<ul>
						{roomsList}
					</ul>
					<ul>
						{teachersList}
					</ul>
				</div>
				<div onClick={this.onSaveChanges}>Click here to save changes</div>
			</div>
		);
	}
});

export default DataForm;