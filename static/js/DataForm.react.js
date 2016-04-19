import EditBox from './EditBox.react.js';

var DataForm = React.createClass({
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

	onCreateTeacher: function(){
		this.props.onCreateTeacher(this.state.teacherAdd);
		this.setState({
			teacherAdd: ""
		});
	},

	onCreateRoom: function(){
		this.props.onCreateRoom(this.state.roomAdd);
		this.setState({
			roomAdd: ""
		});
	},

	onCreateTime: function(){
		this.props.onCreateTime(this.state.timeAdd);
		this.setState({
			timeAdd: ""
		});
	},

	onCreateClass: function(){
		this.props.onCreateClass(this.state.classAdd);
		this.setState({
			classAdd: ""
		});
	},

	render: function(){
		var classesList = this.props.classes.map(function(_class){
			return <EditBox onConfirm={this.onChangeClass} key={_class.class} content={_class.class} />;
		}.bind(this));

		var timesList = this.props.times.map(function(time){
			return <EditBox onConfirm={this.onChangeTime} key={time.start_time + time.end_time} content={time.start_time + time.end_time} />;
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
					<li><input type="text" onChange={this.onClassAdd} value={this.state.classAdd}/><span onClick={this.onCreateClass}>add</span></li>
				</ul>
				<ul>
					<lh><strong>Times</strong></lh>
					{timesList}
					<li><input type="text" onChange={this.onTimeAdd} value={this.state.timeAdd}/><span onClick={this.onCreateTime}>add</span></li>
				</ul>
				<ul>
					<lh><strong>Rooms</strong></lh>
					{roomsList}
					<li><input type="text" onChange={this.onRoomAdd} value={this.state.roomAdd}/><span onClick={this.onCreateRoom}>add</span></li>
				</ul>
				<ul>
					<lh><strong>Teachers</strong></lh>
					{teachersList}
					<li><input type="text" onChange={this.onTeacherAdd} value={this.state.teacherAdd}/><span onClick={this.onCreateTeacher}>add</span></li>
				</ul>
			</div>
		);
	}
});

export default DataForm;