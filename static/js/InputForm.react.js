var InputForm = React.createClass({
    getInitialState: function(){
        return {
            teacherConstraints: {},
            timeConstraints: {},
            classConstraints: {},
            roomConstraints: {},
            selectedConstraint: ""
        }
    },

    onConstraintChange: function(e){
        this.setState({selectedConstraint: e.target.value});
    },

    renderTeacherMenu: function(){
        return(
            <TeacherMenu 
                onCreateConstraint={this.props.onCreateTeacherConstraint} 
                rooms={this.props.rooms} 
                times={this.props.times} 
                classes={this.props.classes} 
                teachers={this.props.teachers} 
            />
        );
    },
    
    renderClassMenu: function(){
        return(
            <div>
                <ClassMenu 
                    onCreateConstraint={this.props.onCreateClassConstraint} 
                    rooms={this.props.rooms} 
                    times={this.props.times} 
                    classes={this.props.classes} 
                    teachers={this.props.teachers} 
                />
            </div>
        );
    },
    
    renderRoomMenu: function(){
        return(
            <div>
                <RoomMenu 
                    onCreateConstraint={this.props.onCreateRoomConstraint} 
                    rooms={this.props.rooms} 
                    times={this.props.times} 
                    classes={this.props.classes} 
                    teachers={this.props.teachers} 
                />
            </div>
        );
    },

    render: function(){
        var detailedConstraintMenu;
        switch(this.state.selectedConstraint){
            case "teacher":
                detailedConstraintMenu = this.renderTeacherMenu();
                break;
            case "class":
                detailedConstraintMenu = this.renderClassMenu();
                break;
            case "room":
                detailedConstraintMenu = this.renderRoomMenu();
                break;
        }
                
        return (
          <div>
            <h2>Add a constraint</h2>
            <div>
              <select value={this.state.selectedConstraint} onChange={this.onConstraintChange} name="constraint-list" form="constraint-form">
                <option value="" disabled="disabled">Select a constraint</option>
                  <option value="teacher">Teacher</option>
                  <option value="class">Class</option>
                  <option value="room">Room</option>
              </select>
            </div>
            {detailedConstraintMenu}
          </div>
        );
    }
});

export default InputForm;