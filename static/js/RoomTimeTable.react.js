import DataCell from './DataCell.react.js';
import React from 'react';

var RoomTimeTable = React.createClass({
    displayName: "RoomTimeTable",

    getInitialState: function(){
        return({
            rooms: this.props.rooms,
            times: this.props.times,
            roomStatuses: {}
        });
    },

    onTimeClick: function(room, time){
	var daysString = "";
	for(var x in time.days){
		daysString += time.days[x];
	}

        var currentStatus = this.state.roomStatuses[room.room + time.start + time.end + daysString],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {room: room.room, time: time.start + time.end + daysString}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {room: room.room, time: "not " + time.start + time.end + daysString}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.roomStatuses;
        temp[room.room + time.start + time.end + daysString] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(room.room, time.start + time.end + daysString);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.rooms.map(function(room){
		var daysString = "";
		for(var x in time.days){
			daysString += time.days[x];
		}
                if(!(room.room + time.start + time.end + daysString in temp)){
                    temp[room.room + time.start + time.end + daysString] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({roomStatuses: temp});
    },
  
    onHover: function(){
	this.setState({
	    hover: true
	});
    },

    offHover: function(){
	this.setState({
	    hover: false
	});
    },

    render: function(){
        var timeHeaders = this.props.times.map(function(time){
            return (
                <th scope="col" key={time.start + time.end}>
                    {time.start + " - " + time.end + " " + time.days}
                </th>
            );
        });

        timeHeaders.unshift(<th key="empty"></th>);

        var roomHeaders = this.props.rooms.map(function(room){
            var tableCells = this.props.times.map(function(time){
                var timeClick = function(){
                    this.onTimeClick(room, time);
                }.bind(this);
		var daysString = "";
		for(var x in time.days){
			daysString += time.days[x];
		}
                return (
                    <DataCell status={this.state.roomStatuses[room.room + time.start + time.end + daysString]} onClick={timeClick} key={room.room + time.start + time.end + daysString} />
                );                        
            }.bind(this));
            return (
                <tr key={room.room}>
                    <th scope="row">{room.room}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

	var content;
	var glyphicon = <strong>{"+"}</strong>;
	if(this.props.display){
	glyphicon = <strong>{"-"}</strong>;
	content = (
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

	if(!this.state.hover){
		glyphicon = null;
	}

        return(
	    <div>
		<h4 className="toggle" onMouseOver={this.onHover} onMouseOut={this.offHover} onClick={this.props.onToggle}>Room - Time Constraints {glyphicon}</h4>
		{content}
	    </div>
       );
    }
});

export default RoomTimeTable;
