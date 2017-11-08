import React, { Component } from 'react';
import firebase from 'firebase';
import Button from 'material-ui/Button';

import './App.css';

import SimpleCard from './Card';

// Required for side-effects
require('firebase/firestore');

firebase.initializeApp({
  apiKey: 'AIzaSyD0x0uei5F_CeDTAG0-nic7SfbKcr1CVoY',
  authDomain: 'firestore-test-96633.firebaseapp.com',
  projectId: 'firestore-test-96633'
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

const statuses = ['PENDING', 'COMPLETED', 'IN PROGRESS', 'ONSITE'];

function addData() {
  db
    .collection('jobs')
    .add({
      jobId: `N${Math.round(Math.random() * 1000)}B`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
    .then(function() {
      console.log('Document successfully written!');
    });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: {}
    };
  }

  componentWillMount() {
    db
      .collection('jobs')
      .orderBy('status')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const id = doc.id;
          this.setState({
            jobList: {
              ...this.state.jobList,
              [id]: doc.data()
            }
          });
        });
      });

    db.collection('jobs').onSnapshot(querySnapshot => {
      querySnapshot.docChanges.forEach(change => {
        if (change.type === 'added') {
          const id = change.doc.id;
          this.setState({
            jobList: {
              ...this.state.jobList,
              [id]: change.doc.data()
            }
          });
        }
      });
    });
  }
  render() {
    const jobList =
      this.state.jobList &&
      Object.keys(this.state.jobList).map(id => (
        <SimpleCard data={this.state.jobList[id]} key={id} />
      ));
    return (
      <div className="App">
        {jobList}
        <Button
          onClick={addData}
          raised
          component="span"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20
          }}
        >
          Add
        </Button>
      </div>
    );
  }
}

export default App;
