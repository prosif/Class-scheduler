import React from 'react';

var EditBox = React.createClass({
        displayName: "EditBox",

	getInitialState: function(){
		return{
			editing: false,
			content: this.props.content
		}
	},

	onClick: function(){
		if(this.state.content != "Other"){
			this.setState({
				editing: !this.state.editing
			});
		}
	},

	onChange: function(e){
		this.setState({
			content: e.target.value
		});
	},

	onConfirm: function(){
		this.props.onEdit();
		this.props.onConfirm(this.props.content, this.state.content);
		this.setState({
			editing: false
		});
	},

	onCancel: function(){
		this.setState({
			content: this.props.content,
			editing: false
		})
	},

	onDelete: function(){
		this.props.onEdit();
		this.props.onDelete(this.props.content);
	},

	showPencil: function(){
		if(this.state.content != "Other"){
			this.setState({
				showPencil: true
			});
		}
	},

	hidePencil: function(){
		this.setState({
			showPencil: false
		});
	},
	
	render: function(){
		var pencil;
		if(this.state.showPencil){
			pencil = <span className="glyphicon glyphicon-pencil" />;
		}
		if(this.state.editing){
			return (
				<li>
					<input type="text" value={this.state.content} onChange={this.onChange} /><br />
					<div className="btn btn-default" onClick={this.onDelete}>Delete</div>
					<div className="btn btn-default" onClick={this.onCancel}>Cancel</div>
					<div className="btn btn-default" onClick={this.onConfirm}>Confirm </div>
					
				</li>
			);
		}
		else{
			return <li className="edit" onMouseOver={this.showPencil} onMouseOut={this.hidePencil} onClick={this.onClick}>{this.state.content}{pencil}</li>;
		}
	}
});

export default EditBox;
