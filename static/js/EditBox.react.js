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
		this.setState({
			editing: !this.state.editing
		});
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

	render: function(){
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
			return <li onClick={this.onClick}>{this.state.content}</li>;
		}
	}
});

export default EditBox;
