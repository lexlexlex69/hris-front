import React, { useState, useRef, useEffect } from 'react';
import { Scheduler, CellProps } from "@aldabil/react-scheduler";
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

const CalendarEvents = () => {
    const [admin, setAdmin] = useState(true)
    const [events, setEvents] = useState([])
    const timeRef = useRef(true)
    const handleConfirm = async (event, action) => {
        if (!admin) {
            toast.warning('Sorry you are not allowed to alter data')
            return new Promise((res, rej) => {
                rej('Restricted');
                toast.error('Restricted')
            });
        }
        if (action === "edit") {
            /** PUT event to remote DB */
            return new Promise((resolve, rej) => {
                axios.post('/api/dashboard/calendar/updateEvent', event)
                    .then(res => {
                        if (res.data.status === 200) {
                            toast.success('event updated!')
                            res.data.events.id = Number(res.data.events.id)
                            res.data.events.start = new Date(res.data.events.start)
                            res.data.events.end = new Date(res.data.events.end)
                            resolve({
                                ...res.data.events,
                                event_id: res.data.events.event_id || Math.random()
                            });
                        }
                    })
                    .catch(err => {
                        toast.error(err.message)
                        console.log(err)
                        rej(err.message)
                    })
            });
        } else if (action === "create") {
            /**POST event to remote DB */
            event.start = moment(new Date(event.start)).format()
            event.end = moment(new Date(event.end)).format()
            return new Promise((resolve, rej) => {
                axios.post('/api/dashboard/calendar/createEvent', event)
                    .then(res => {
                        if (res.data.status === 200) {
                            toast.success('new event added!')
                            res.data.events.id = Number(res.data.events.id)
                            res.data.events.start = new Date(res.data.events.start)
                            res.data.events.end = new Date(res.data.events.end)
                            resolve({
                                ...res.data.events,
                                event_id: res.data.events.event_id || Math.random()
                            });
                        }
                    })
                    .catch(err => {
                        toast.error(err.message)
                        console.log(err)
                        rej(err.message)
                    })
            });

        }

    }

    const handleDelete = async (event_id) => {
        return new Promise(resolve => {
            axios.post('/api/dashboard/calendar/deleteEvent', { id: event_id })
                .then(res => {
                    if (res.data.status === 200) {
                        toast.success('Event deleted!')
                        resolve(event_id)
                    }
                })
                .catch(err => {
                    toast.error(err.message)
                    console.log(err)
                })
        })
    }

    const fetchRemote = async (query) => { // fetch during onMount of the component
        return new Promise((resolve) => {
            axios.post(`/api/dashboard/calendar/fetchEvents${query}`)
                .then(res => {
                    if (res.data.status === 200) {
                        let newArr = res.data.events.map(x => { return { ...x, event_id: Number(x.event_id), start: new Date(x.start), end: new Date(x.end) } })
                        resolve(newArr)
                    }
                })
                .catch(err => {
                    toast.error(err.message)
                    console.log(err)
                })
        })
    }

    return (
        <Scheduler
            view="month"
            height={400}
            month={{
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                weekStartOn: 1,
                startHour: 9,
                endHour: 17,
            }}
            week={{
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                weekStartOn: 1,
                startHour: 9,
                endHour: 17,
                step: 60,
            }}

            day={{
                startHour: 9,
                endHour: 17,
                step: 60
            }}
            customEditor={false}
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            remoteEvents={fetchRemote}
            events={events}
            selectedDate={new Date()}
        />
    );
};

export default CalendarEvents;