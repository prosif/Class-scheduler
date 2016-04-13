var TeacherMenu = React.createClass({
    getInitialState: function(){
        return {
            selectedTeacher: "",
            restrictionType: "",
            restrictionValue: ""
        }
    },

    handleTeacherSelect: function(e){
        this.setState({selectedTeacher: e.target.value});
    },

    handleRestrictionChange: function(e){
        this.setState({restrictionType: e.target.value});
    },

    handleConstraintChange: function(e){
        this.setState({restrictionValue: e.target.value});
    },

    onCreateConstraint: function(){
        if(this.state.restrictionType && this.state.restrictionValue && this.state.selectedTeacher){
            this.props.onCreateConstraint(this.state);
        }
    },

    render: function(){
        var options;
        var teacherOptions = this.props.teachers.map(function(teacher){
            return <option key={teacher.name} value={teacher.name}>{teacher.name}</option>;
        });

        if(this.state.restrictionType.indexOf("time") > -1){
            options =  this.props.times.map(function(time){
                return <option value={time.time} key={time.time}>{time.time}</option>;
            });
        }
        else if(this.state.restrictionType.indexOf("class") > -1){
            options =  this.props.classes.map(function(_class){
                return <option value={_class.class} key={_class.class}>{_class.class}</option>;
            });
        }
        else{
            options = this.props.rooms.map(function(room){
                return <option value={room.room} key={room.room}>{room.room}</option>;
            });
        }
    
        teacherOptions.unshift(<option key="" disabled="disabled" value="">Select a teacher</option>);
        options.unshift(<option key="" disabled="disabled" value="">Select...</option>);
        return (
          <div>
            <select onChange={this.handleTeacherSelect} value={this.state.selectedTeacher}>
              {teacherOptions}
            </select> 
            <select onChange={this.handleRestrictionChange} value={this.state.restrictionType}>
                <option value="" disabled="disabled">Select...</option>
                <option value="must teach at time">must teach at time</option>
                <option value="must not teach at time">must not teach at time</option>
                <option value="must teach in room">must teach in room</option>
                <option value="must not teach in room">must not teach in room</option>
                <option value="must teach class">must teach class</option>
                <option value="must not teach class">must not teach class</option>
            </select>
            <select onChange={this.handleConstraintChange} value={this.state.restrictionValue}>
                {options}
            </select>
            <div onClick={this.onCreateConstraint}>Create constraint</div>
          </div>
        
        );
    }
});

export default TeacherMenu;