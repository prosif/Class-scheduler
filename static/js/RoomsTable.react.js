import DataCell from './DataCell.react.js';
import React from 'react';

var RoomsTable = React.createClass({
    displayName: "RoomsTable",

    getInitialState: function(){
        return({
            rooms: this.props.rooms,
            classes: this.props.classes,
            roomStatuses: {}
        });
    },

    onRoomClick: function(_class, room){
        var currentStatus = this.state.roomStatuses[room.room + _class.class],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {room: room.room, _class: _class.class}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {room: room.room, _class: "not " + _class.class}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.roomStatuses;
        temp[room.room + _class.class] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(room.room, _class.class);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.rooms.map(function(room){
            this.props.classes.map(function(_class){
                if(!(room.room + _class.class in temp)){
                    temp[room.room + _class.class] = null;
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
        var roomHeaders = this.props.rooms.map(function(room){
            return (
                <th scope="col" key={room.room}>
                    {room.room}
                </th>
            );
        });

        roomHeaders.unshift(<th key="empty"></th>);

        var classHeaders = this.props.classes.map(function(_class){
            var tableCells = this.props.rooms.map(function(room){
                var roomClick = function(){
                    this.onRoomClick(_class, room);
                }.bind(this);
                return (
                    <DataCell status={this.state.roomStatuses[room.room + _class.class]} onClick={roomClick} key={_class.class + room.room} class={_class} room={room} />
                );                        
            }.bind(this));
            return (
                <tr key={_class.class}>
                    <th scope="row">{_class.class}</th>
                    {tableCells}
                </tr>
            );
        }.bind(this));

	var content;
	var glyphicon = <strong>{"+"}</strong>;
	if(this.props.display){
	    glyphicon = <strong>{"-"}</strong>;
	    content = (
		<div>
		<table id="rooms-table">
                    <thead>
                        <tr>{roomHeaders}</tr>
                    </thead>
                    <tbody>
                        {classHeaders}
                    </tbody>
                </table>
		</div>
	    );
	}
	
	if(!this.state.hover){
	    glyphicon = null;
	}
	
        return(
	    <div>
		<h4 onMouseOver={this.onHover} onMouseOut={this.offHover} className="toggle" onClick={this.props.onToggle}>Course - Room Constraints {glyphicon}</h4>

		{content}
	    </div>
        );
    }
});

export default RoomsTable;
