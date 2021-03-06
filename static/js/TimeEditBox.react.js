import React from 'react';

var TimeEditBox = React.createClass({
	getInitialState: function(){
 		var days = {"M": false, "T": false, "W": false, "Th": false, "F": false, "Sat": false, "Sun": false};
		for(var x in this.props.time.days){
			days[this.props.time.days[x]] = true;
		}
		return{
			editing: false,
			time: this.props.time,
			start: this.props.time.start,
			end: this.props.time.end,
			days: days
		}
	},

	onClick: function(){
		this.setState({
			editing: !this.state.editing
		});
	},

	onStartChange: function(e){
		this.setState({
			start: e.target.value
		});
	},

	onEndChange: function(e){
		this.setState({
			end: e.target.value
		});
	},

	onAdd: function(){
		var daysArray = [], currentDays = this.state.days;
		if(currentDays.M){
			daysArray.push("M");
		}
		if(currentDays.T){
			daysArray.push("T");
		}
		if(currentDays.W){
			daysArray.push("W");
		}
		if(currentDays.Th){
			daysArray.push("Th");
		}
		if(currentDays.F){
			daysArray.push("F");
		}
		if(currentDays.Sat){
			daysArray.push("Sat");
		}
		if(currentDays.Sun){
			daysArray.push("Sun");
		}

		var newTime = {start: this.state.start, end: this.state.end, days: daysArray};
		if(this.props.onAdd(newTime)){
			this.props.onEdit();
			this.setState({
				editing: false,
				time: newTime,
				start: "",
				end: "",
				days: []
			});
		}
	},

	onCancelCreate: function(){
		this.props.onCancel();
		this.setState({
			start: "",
			end: "",
			days: []
		});
	},

	onConfirm: function(){
		// Need to convert days object back into array. I did not think this through
		this.props.onEdit();
		var daysArray = [], currentDays = this.state.days;
		if(currentDays.M){
			daysArray.push("M");
		}
		if(currentDays.T){
			daysArray.push("T");
		}
		if(currentDays.W){
			daysArray.push("W");
		}
		if(currentDays.Th){
			daysArray.push("Th");
		}
		if(currentDays.F){
			daysArray.push("F");
		}
		if(currentDays.Sat){
			daysArray.push("Sat");
		}
		if(currentDays.Sun){
			daysArray.push("Sun");
		}

		var newTime = {start: this.state.start, end: this.state.end, days: daysArray};
		this.props.onConfirm(this.props.time, newTime);
		this.setState({
			editing: false,
			time: newTime,
		});
	},

	onCancel: function(){
		this.setState({
			time: this.props.time,
			editing: false
		})
	},

	onDelete: function(){
		this.props.onEdit();
		this.props.onDelete(this.props.time);
	},

	onCheck: function(box){
		var val = box.target.value;
		var tempDays = this.state.days;
		tempDays[val] = !tempDays[val];
		this.setState({
			days: tempDays
		});
	},
	
	showPencil: function(){
		this.setState({
			showPencil: true
		});
	},

	hidePencil: function(){
		this.setState({
			showPencil: false
		});
	},

	render: function(){
		var buttons;
		if(this.props.add){
			buttons = (
			<div>
				<div className="btn btn-default" onClick={this.onAdd}>Add</div>
				<div className="btn btn-default" onClick={this.onCancelCreate}>Cancel</div>
			</div>
		);
		}
		else{
			buttons = (
				<span>
					<div className="btn btn-default" onClick={this.onCancel}>Cancel</div>					
					<div className="btn btn-default" onClick={this.onDelete}>Delete</div>
					<div className="btn btn-default" onClick={this.onConfirm}>Confirm </div>
				</span>
			);

		}
	
		var pencil;

		if(this.state.showPencil){
			pencil = <span className="glyphicon glyphicon-pencil" />;
		}

		if(this.state.editing || this.props.add){
			return (
				<li>
					Start time: (xxxx) <input type="number" value={this.state.start} onChange={this.onStartChange} /><br />
					End time: (xxxx) <input type="number" value={this.state.end} onChange={this.onEndChange} /><br />
					Days:<br />
					Monday <input type="checkbox" name={"M"} value={"M"} checked={this.state.days.M} onChange={this.onCheck} /><br />
					Tuesday <input type="checkbox" name={"T"} value={"T"} checked={this.state.days.T} onChange={this.onCheck} /><br />
					Wednesday <input type="checkbox" name={"W"} value={"W"} checked={this.state.days.W} onChange={this.onCheck} /><br />
					Thursday <input type="checkbox" name={"Th"} value={"Th"} checked={this.state.days.Th} onChange={this.onCheck} /><br />
					Friday <input type="checkbox" name={"F"} value={"F"} checked={this.state.days.F} onChange={this.onCheck} /><br />
					Saturday <input type="checkbox" name={"Sat"} value={"Sat"} checked={this.state.days.Sat} onChange={this.onCheck} /><br />
					Sunday <input type="checkbox" name={"Sun"} value={"Sun"} checked={this.state.days.Sun} onChange={this.onCheck} /><br />
					{buttons}
					<br />
					{this.props.dupeText}
				</li>
			);
		}
		else{
			return <li className="edit" onMouseOver={this.showPencil} onMouseOut={this.hidePencil} onClick={this.onClick}>{this.state.time.start + "-" + this.state.time.end + " " + this.state.time.days}{pencil}</li>;
		}
	}
});

export default TimeEditBox;
