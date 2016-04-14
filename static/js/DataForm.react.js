import EditBox from './EditBox.react.js';

var DataForm = React.createClass({
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
			<div id="data-lists">
				<ul>
					<lh><strong>Classes</strong></lh>
					{classesList}
				</ul>
				<ul>
					<lh><strong>Times</strong></lh>
					{timesList}
				</ul>
				<ul>
					<lh><strong>Rooms</strong></lh>
					{roomsList}
				</ul>
				<ul>
					<lh><strong>Teachers</strong></lh>
					{teachersList}
				</ul>
			</div>
		);
	}
});

export default DataForm;