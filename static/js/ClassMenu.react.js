var ClassMenu = React.createClass({
    getInitialState: function(){
        return {
            selectedClass: "",
            restrictionType: "",
            restrictionValue: ""
        }
    },

    handleClassSelect: function(e){
        this.setState({selectedClass: e.target.value});
    },

    handleRestrictionChange: function(e){
        this.setState({restrictionType: e.target.value});
    },

    handleConstraintChange: function(e){
        this.setState({restrictionValue: e.target.value});
    },

    onCreateConstraint: function(){
        if(this.state.restrictionType && this.state.restrictionValue && this.state.selectedClass){
            this.props.onCreateConstraint(this.state);
        }
    },

    render: function(){
        var options;

        var classOptions = this.props.classes.map(function(_class){
            return <option value={_class.class} key={_class.class}>{_class.class}</option>;
        });
        
        if(this.state.restrictionType.indexOf("time") > -1){
            options =  this.props.times.map(function(time){
                return <option value={time.time} key={time.time}>{time.time}</option>;
            });
        }
        else if(this.state.restrictionType.indexOf("room") > -1){
            options =  this.props.rooms.map(function(room){
                return <option value={room.room} key={room.room}>{room.room}</option>;
            });
        }
        else{
            options = this.props.teachers.map(function(teacher){
                return <option key={teacher.name} value={teacher.name}>{teacher.name}</option>;
            });
        }
                        
        classOptions.unshift(<option key="" disabled="disabled" value="">Select a class</option>);
        options.unshift(<option key="" disabled="disabled" value="">Select...</option>);
        
        return (
          <div>
            <select onChange={this.handleClassSelect} value={this.state.selectedClass}>
              {classOptions}
            </select> 
            <select onChange={this.handleRestrictionChange} value={this.state.restrictionType}>
                <option value="" disabled="disabled">Select...</option>
                <option value="must be taught at time">must be taught at time</option>
                <option value="must not be taught at time">must not be taught at time</option>
                <option value="must be taught in room">must be taught in room</option>
                <option value="must not be taught in room">must not be taught in room</option>
                <option value="must be taught by">must be taught by</option>
                <option value="must not be taught by">must not be taught by</option>
            </select>
            <select onChange={this.handleConstraintChange} value={this.state.restrictionValue}>
                {options}
            </select>
            <div onClick={this.onCreateConstraint}>Create constraint</div>
          </div>
        
        );
    }

});

export default ClassMenu;