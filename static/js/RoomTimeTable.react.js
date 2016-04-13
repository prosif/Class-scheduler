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
        var currentStatus = this.state.roomStatuses[room.room + time.time],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {room: room.room, time: time.time}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {toom: room.room, time: "not " + time.time}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.roomStatuses;
        temp[room.room + time.time] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(room.room, time.time);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.rooms.map(function(room){
                if(!(room.room + time.time in temp)){
                    temp[room.room + time.time] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({roomStatuses: temp});
    },

    render: function(){
        var timeHeaders = this.props.times.map(function(time){
            return (
                <th scope="col" key={time.time}>
                    {time.time}
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
                    <DataCell status={this.state.roomStatuses[room.room + time.time]} onClick={timeClick} key={room.room + time.time} />
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
            <table>
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