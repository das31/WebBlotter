import React, { Component } from "react";
import ReactTable, { ReactTableDefaults } from "react-table";
//https://github.com/tannerlinsley/react-table
//https://react-table.js.org/
import "react-table/react-table.css";

Object.assign(ReactTableDefaults, {
  defaultPageSize: 10,
  minRows: 3
});

class DraggableTable extends Component {
  constructor(props) {
    super(props);
    this.dragged = null;
    this.reorder = [];
    this.state = {
      trigger: 0
    };
  }
  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll(".draggable-header")
    );

    headers.forEach((header, i) => {
      header.setAttribute("draggable", true);
      //the dragged header
      header.ondragstart = e => {
        e.stopPropagation();
        this.dragged = i;
      };

      header.ondrag = e => e.stopPropagation;

      header.ondragend = e => {
        e.stopPropagation();
        setTimeout(() => (this.dragged = null), 1000);
      };

      //the dropped header
      header.ondragover = e => {
        e.preventDefault();
      };

      header.ondrop = e => {
        e.preventDefault();
        const { target, dataTransfer } = e;
        this.reorder.push({ a: i, b: this.dragged });
        this.setState({ trigger: Math.random() });
      };
    });
  }
  componentDidMount() {
    this.mountEvents();
  }

  componentDidUpdate() {
    this.mountEvents();
  }
  render() {
    const { rows, columns } = this.props;

    const cols = columns.map(col => ({
      ...col,
      Header: <span className="draggable-header">{col.Header}</span>
    }));

    //run all reorder events
    this.reorder.forEach(o => cols.splice(o.a, 0, cols.splice(o.b, 1)[0]));

    //render
    return (
      <div className="esr-table">
        <ReactTable {...this.props} data={rows} columns={cols} />
      </div>
    );
  }
}

export default DraggableTable;
