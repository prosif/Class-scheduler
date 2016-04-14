var EditBox = React.createClass({
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

	render: function(){
		if(this.state.editing){
			return (
				<li>
					<input type="text" value={this.state.content} onChange={this.onChange} />
					<span onClick={this.onCancel} className="glyphicon glyphicon-remove" />
					<span onClick={this.onConfirm} className="glyphicon glyphicon-ok" />
				</li>
			);
		}
		else{
			return <li onClick={this.onClick}>{this.state.content}</li>;
		}
	}
});

export default EditBox;