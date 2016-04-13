var ConstraintList = React.createClass({
    onGenerate: function(){
        var allConstraints = this.props.teacherConstraints.concat(this.props.roomConstraints).concat(this.props.classConstraints);
        console.log(allConstraints);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/generate',
            data: {
                "teachers": JSON.stringify(this.props.teachers), 
                "classes": JSON.stringify(this.props.classes), 
                "rooms": JSON.stringify(this.props.rooms), 
                "times": JSON.stringify(this.props.times), 
                "teacher_constraints": JSON.stringify(this.props.teacherConstraints),
                "class_constraints": JSON.stringify(this.props.classConstraints), 
                "room_constraints": JSON.stringify(this.props.roomConstraints)
            },
            success: function(response){
                this.props.onGenerateSuccess(JSON.parse(response));
            }.bind(this),
        });
    },

    render: function(){
        var teacherConstraints = this.props.teacherConstraints.map(function(constraint){
            return <li key={constraint.selectedTeacher+constraint.restrictionType+constraint.restrictionValue}>{constraint.selectedTeacher} {constraint.restrictionType} {constraint.restrictionValue}</li>;
        });
        var roomConstraints = this.props.roomConstraints.map(function(constraint){
            return <li key={constraint.selectedRoom+constraint.restrictionType+constraint.restrictionValue}>{constraint.selectedRoom} {constraint.restrictionType} {constraint.restrictionValue}</li>;
        });
        var classConstraints = this.props.classConstraints.map(function(constraint){
            return <li onClick={this.props.onDeleteClassConstraint} key={constraint.selectedClass+constraint.restrictionType+constraint.restrictionValue}>{constraint.selectedClass} {constraint.restrictionType} {constraint.restrictionValue}</li>;
        }.bind(this));

        return(
            <div>
                <h3>
                    Constraints
                </h3>
                <ul>
                    {teacherConstraints}
                </ul>
                <ul>
                    {roomConstraints}
                </ul>
                <ul>
                    {classConstraints}
                </ul>
                <div onClick={this.onGenerate}>Click here to generate schedule with these constraints</div>
            </div>
        );
    }
});

export default ConstraintList;