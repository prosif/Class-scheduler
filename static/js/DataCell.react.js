var DataCell = React.createClass({
    getInitialState: function(){
        return ({
            status: this.props.status
        });
    },

    render: function(){
        var content = "-";
        switch(this.props.status){
            case "yes":
                content = <span className = "glyphicon glyphicon-ok" />;
                break;
            case "no":
                content = <span className = "glyphicon glyphicon-remove" />;
                break;
        }
        return (
            <td className="table-cell" onClick={this.props.onClick}>
                {content}
            </td>
        );
    }
});

export default DataCell;