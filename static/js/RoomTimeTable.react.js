import DataCell from './DataCell.react.js';

var RoomTimeTable = React.createClass({
    getInitialState: function(){
        return({
            rooms: this.props.rooms,
            times: this.props.times,
            roomStatuses: {}
        });
    },

    onTimeClick: function(room, time){
        var currentStatus = this.state.roomStatuses[room.room + time.start_time + time.end_time],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {room: room.room, time: time.start_time + time.end_time}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {room: room.room, time: "not " + time.start_time + time.end_time}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.roomStatuses;
        temp[room.room + time.start_time + time.end_time] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(room.room, time.start_time + time.end_time);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.rooms.map(function(room){
                if(!(room.room + time.start_time + time.end_time in temp)){
                    temp[room.room + time.start_time + time.end_time] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({roomStatuses: temp});
    },

    render: function(){
        var timeHeaders = this.props.times.map(function(time){
            return (
                <th scope="col" key={time.start_time + time.end_time}>
                    {time.start_time + time.end_time}
                </th>
            );
        });

        timeHeaders.unshift(<th key="empty"></th>);

        var roomHeaders = this.props.rooms.map(function(room){
            var tableCells = this.props.times.map(function(time){
                var timeClick = function(){
                    this.onTimeClick(room, time);
                }.bind(this);
                return (
                    <DataCell status={this.state.roomStatuses[room.room + time.start_time + time.end_time]} onClick={timeClick} key={room.room + time.start_time + time.end_time} />
                );                        
            }.bind(this));
            return (
                <tr key={room.room}>
                    <th scope="row">{room.room}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

        return(
            <table id="room-time-table">
                <thead>
                    <tr>{timeHeaders}</tr>
                </thead>
                <tbody>
                    {roomHeaders}
                </tbody>
            </table>
        );
    }
});

export default RoomTimeTable;
