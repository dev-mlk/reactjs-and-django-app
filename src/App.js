/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import Modal from './components/Modal';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        description: "",
        completed: false
      },
      todoList: [],
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
    .get("http://localhost:8000/api/tasks/")
    .then(res => this.setState({ todoList: res.data}))
    .catch(err => console.log(err))
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  // handle add
  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
      .put(`http://localhost:8000/api/tasks/${item.id}`, item)
      .then(res => this.refreshList())
    }
    axios
    .post("http://localhost:8000/api/tasks/", item)
    .then(res => this.refreshList())
  };
  
  // handle delete
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList())
  };

  // handle create
  createItem = () => {
    const item = { title: "", modal: !this.state.modal };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // handle edit
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal })
  }

  


  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true })
    }
    return this.setState({ viewCompleted: false })
  }

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}>
          Completed
        </span>
        <span onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}>
          Incompleted
        </span>
      </div>
    )
  }
  // rendering items in the list completed || incompleted
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.title}>
          {item.title}
        </span>
        <span>
          <button className="btn btn-success mr-2" onClick={() => this.editItem(item)}>Edit</button>
          <button className="btn btn-danger mr-2" onClick={() => this.handleDelete(item)}>Delete</button>
        </span>
      </li>
    ))
  };


  render() {
    return (
      <main className="content p-3 mb2 bg-info">
        <h1 className="text-black text-uppercase text-center my-4">Tasks Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button className="btn btn-secondary" onClick={this.createItem}>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-3 mb-2 bg-info text-center">Copyright &copy;2021 All Right Reserved</footer>
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ): null}
      </main>
    )
  }

}

export default App;
