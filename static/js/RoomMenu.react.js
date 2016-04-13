var RoomMenu = React.createClass({
    getInitialState: function(){
        return {
            selectedRoom: "",
            restrictionType: "",
            restrictionValue: ""
        }
    },

    handleRoomSelect: function(e){
        this.setState({selectedRoom: e.target.value});
    },

    handleRestrictionChange: function(e){
        this.setState({restrictionType: e.target.value});
    },

    handleConstraintChange: function(e){
        this.setState({restrictionValue: e.target.value});
    },

    onCreateConstraint: function(){
        this.props.onCreateConstraint(this.state);
    },

    render: function(){
        var options;
        var roomOptions = this.props.rooms.map(function(room){
            return <option key={room.room} value={room.room}>{room.room}</option>;
        });

        if(this.state.restrictionType.indexOf("time") > -1){
            options =  this.props.times.map(function(time){
                return <option value={time.time} key={time.time}>{time.time}</option>;
            });
        }
        else{
            options =  this.props.classes.map(function(_class){
                return <option value={_class.class} key={_class.class}>{_class.class}</option>;
            });
        }
    
        roomOptions.unshift(<option key="" disabled="disabled" value="">Select a room</option>);
        options.unshift(<option key="" disabled="disabled" value="">Select...</option>);
        return (
          <div>
            <select onChange={this.handleRoomSelect} value={this.state.selectedRoom}>
              {roomOptions}
            </select> 
            <select onChange={this.handleRestrictionChange} value={this.state.restrictionType}>
                <option value="is available at time">is available at time</option>
                <option value="is not available at time">is not available at time</option>
                <option value="is required for class">is required for class</option>
                <option value="is not available for class">is not available for class</option>
            </select>
            <select onChange={this.handleConstraintChange} value={this.state.restrictionValue}>
                {options}
            </select>
            <div onClick={this.onCreateConstraint}>Create constraint</div>
          </div>
        
        );
    }
});

export default RoomMenu;