import React from 'react'
import axios from 'axios'
import EventForm from './EventForm'
import './Eventlite.css'
import Container from 'react-bootstrap/Container'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

class ZmateCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }
  }

  // componentDidMount() {
  //   axios({
  //     method: 'GET',
  //     url: 'http://localhost:3001/events'
  //   })
  //   .then(response => {
  //     this.setState({events: response.data})
  //   })
  // }

  addNewEvent = (event) => {
    const events = [...this.state.events, event].sort(function(a, b){
      return new Date(a.start_datetime) - new Date(b.start_datetime)
    })
    this.setState({events: events})
  }

  render() {
    const currentUser = localStorage.getItem('user')
    return (
      <Container style={{margin:'6rem'}}>
        {currentUser &&
          <>
            <div>Your lecture and discussion schedules are shown below</div>
            <FullCalendar
              plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="timeGridWeek"
              weekends={false}
              events={[
                { title: 'event 1', date: '2019-04-01' },
                { title: 'event 2', date: '2019-04-02' }
              ]}
            />
            {/*<EventForm onSuccess={this.addNewEvent} />*/}
          </>
        }
        {/*<ZmateCalendar events={this.state.events} />*/}
      </Container>
    )
  }
}

export default ZmateCalendar
