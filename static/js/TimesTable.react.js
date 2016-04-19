import DataCell from './DataCell.react.js';

var TimesTable = React.createClass({
    getInitialState: function(){
        return({
            times: this.props.times,
            classes: this.props.classes,
            timeStatuses: {}
        });
    },


    onTimeClick: function(_class, time){
        var currentStatus = this.state.timeStatuses[time.time + _class.class],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {time: time.start_time + time.end_time, _class: _class.class}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {time: time.start_time + time.end_time, _class: "not " + _class.class}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.timeStatuses;
        temp[time.start_time + time.end_time + _class.class] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(time.start_time + time.end_time, _class.class);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.classes.map(function(_class){
                if(!(time.start_time + time.end_time + _class.class in temp)){
                    temp[time.start_time + time.end_time + _class.class] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({timeStatuses: temp});
    },

    render: function(){
        var timeHeaders = this.props.times.map(function(time){
            return (
                <th scope="col" key={time.start_time + time.end_time}>
                    {time.start_time}
                </th>
            );
        });

        timeHeaders.unshift(<th key="empty"></th>);

        var classHeaders = this.props.classes.map(function(_class){
            var tableCells = this.props.times.map(function(time){
                var timeClick = function(){
                    this.onTimeClick(_class, time);
                }.bind(this);
                return (
                    <DataCell status={this.state.timeStatuses[time.start_time + time.end_time + _class.class]} onClick={timeClick} key={_class.class + time.start_time + time.end_time} />
                );                        
            }.bind(this));
            return (
                <tr key={_class.class}>
                    <th scope="row">{_class.class}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

        return(
            <table>
                <thead>
                    <tr>{timeHeaders}</tr>
                </thead>
                <tbody>
                    {classHeaders}
                </tbody>
            </table>
        );
    }
});

export default TimesTable;