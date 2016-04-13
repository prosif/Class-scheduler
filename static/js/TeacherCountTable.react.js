import DataCell from './DataCell.react.js';

var TeacherCountTable = React.createClass({
    getInitialState: function(){
        var counts = {};
        this.props.teachers.map(function(teacher){
            counts[teacher.name] = 0;
        });
        return{
            teacherCounts: counts
        }
    },

    handleChange: function(teacher, val){
        var currentCounts = this.state.teacherCounts;
        currentCounts[teacher] = val;
        this.setState({
            teacherCounts: currentCounts
        });
    },

    render: function(){
        var rows = this.props.teachers.map(function(teacher){
            var handleChange = function(e){
                this.handleChange(teacher.name, e.target.value)
            }.bind(this);
            return (
                <tr key={teacher.name}>
                    <td>{teacher.name}</td>
                    <td>
                        <input type="text" onChange={handleChange} value={this.state.teacherCounts[teacher.name]} />
                    </td>
                </tr>
            );
        }.bind(this));
        return (
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

export default TeacherCountTable;