import DataCell from './DataCell.react.js';
import React from 'react';

var TimesTable = React.createClass({
    getInitialState: function(){
        return({
            times: this.props.times,
            classes: this.props.classes,
            timeStatuses: {}
        });
    },


    onTimeClick: function(_class, time){
        var currentStatus = this.state.timeStatuses[time.start + time.end + _class.class],
            constraint;
        switch(currentStatus){
            case null:
                currentStatus = "yes";
                constraint = {time: time.start + time.end, _class: _class.class}
                break;
            case "yes":
                currentStatus = "no";
                constraint = {time: time.start + time.end, _class: "not " + _class.class}
                break;
            default:
                currentStatus = null;
        }

        var temp = this.state.timeStatuses;
        temp[time.start + time.end + _class.class] = currentStatus;
        this.setState({roomStatuses: temp});

        this.props.onRemove(time.start + time.end, _class.class);

        if(constraint){
            this.props.onCreate(constraint);
        }
    },

    componentDidMount: function(){
        var temp = {};

        this.props.times.map(function(time){
            this.props.classes.map(function(_class){
                if(!(time.start + time.end + _class.class in temp)){
                    temp[time.start + time.end + _class.class] = null;
                }
            }.bind(this));
        }.bind(this));

        this.setState({timeStatuses: temp});
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

        var classHeaders = this.props.classes.map(function(_class){
            var tableCells = this.props.times.map(function(time){
                var timeClick = function(){
                    this.onTimeClick(_class, time);
                }.bind(this);
                return (
                    <DataCell status={this.state.timeStatuses[time.start + time.end + _class.class]} onClick={timeClick} key={_class.class + time.start + time.end} />
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
            <table id="times-table">
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
