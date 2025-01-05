import axios from 'axios'
import { toast } from 'react-toastify'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import CustomEvents from "highcharts-custom-events";

CustomEvents(Highcharts)

export const getAnalytics = (setState) => {
    axios.get(`/api/dashboard/data_analytics/getAllPermanent`)
        .then(res => {
            setState(res.data)
        })
        .catch(err => console.log(err))
}

export const getAnalyticsDetailed = async (setDataAnalytics,setApplicants) => {
        try {
            let detailed = await axios.get(`/api/dashboard/data_analytics/getAllDetailed`)
            console.log('Details', detailed)
            setDataAnalytics(detailed.data)
        }
        catch (err) {
            console.log(err.message)
        }
        try {
            let applicants = await axios.get(`/api/dashboard/data_analytics/getApplicants`)
            console.log('Applicants', applicants)
            setApplicants(applicants.data)
        }
        catch (err) {
            console.log(err.message)
        }
}

export const setDataAnalyticsGraph = (dataAnalytics, setOptions, setCategory) => {
    setOptions({
        chart: {
            type: 'bar',
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: ['TOTAL EMPLOYEE', 'PERMANENT', 'TEMPORARY', 'PRESIDENTIAL APPOINTEES', 'CO-TERMINOS', 'CONTRACTUAL', 'CASUAL', 'JOB ORDER', 'CONSULTANT', 'CONTRACT OF SERVICE', 'MALE', 'FEMALE'],
            title: {
                text: null
            },
            labels: {
                events: {
                    click: function () {
                        setCategory(this.value)
                    }
                }
            },

        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of employees',
                align: 'high'
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: ' employees'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                },
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: (e) => {
                            setCategory(e.point.category)
                        }
                    }
                }
            },
            point: {
                events: {
                    click: (e) => console.log(e)
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: -10,
            floating: true,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            // name: '',
            data: [
                dataAnalytics.total_employees,
                dataAnalytics.permanent,
                dataAnalytics.temporary,
                dataAnalytics.presidential,
                dataAnalytics.cotermino,
                dataAnalytics.contractual,
                dataAnalytics.casual,
                dataAnalytics.jo,
                dataAnalytics.consultant,
                dataAnalytics.cos,
                dataAnalytics.sex && dataAnalytics.sex[2].total,
                dataAnalytics.sex && dataAnalytics.sex[1].total],
        }
        ]
    })
}

// Total Employee graph
export const getEmployeeInfoPerOffice = (office, setState, setLoader, setCount, value, setPage) => {
    setState('')
    setPage(1)
    setLoader(false)
    if (value) {
        setPage(value)
    }
    axios.post(`/api/dashboard/data_analytics/getEmployeeInfoPerOffice${value ? `?page=` + value : ''}`, {
        office: office
    })
        .then(res => {
            console.log(res)
            setLoader(true)
            if (res.data.status === 200) {
                setState(res.data.employees.data)
                setCount(res.data.employees.total)
            }
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
            console.log(err)
        })
}

export const getEmployeeStatusInfoPerOffice = (office, setState, setLoader, setCount, value, setPage,category) => {
    let cat = category === 'PERMANENT' ? 'RE' : category === 'TEMPORARY' ? 'TE' : category === 'PRESIDENTIAL APPOINTEES' ? 'PA' : category === 'CO-TERMINOS' ? 'CT' : category === 'CONTRACTUAL' ? 'CN' : category === 'CASUAL' ? 'CS' : category === 'JOB ORDER' ? 'JO' : category === 'CONSULTANT' ? 'CO' : category === 'CONTRACT OF SERVICE' ? 'COS' : 0
    setState('')
    setPage(1)
    setLoader(false)
    if (value) {
        setPage(value)
    }
    axios.post(`/api/dashboard/data_analytics/getEmployeeStatusInfoPerOffice${value ? `?page=` + value : ''}`, {
        office: office,
        cat: cat
    })
        .then(res => {
            console.log(res)
            setLoader(true)
            if (res.data.status === 200) {
                setState(res.data.employees.data)
                setCount(res.data.employees.total)
            }
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
            console.log(err)
        })
}

export const getEmployeeGenderInfoPerOffice = (office, setState, setLoader, setCount, value, setPage,category) => {
    let cat = category === 'MALE' ? 'Male' : category === 'FEMALE' ? 'Female' : null
    setState('')
    setPage(1)
    setLoader(false)
    if (value) {
        setPage(value)
    }
    axios.post(`/api/dashboard/data_analytics/getEmployeeGenderInfoPerOffice${value ? `?page=` + value : ''}`, {
        office: office,
        cat: cat
    })
        .then(res => {
            console.log(res)
            setLoader(true)
            if (res.data.status === 200) {
                setState(res.data.employees.data)
                setCount(res.data.employees.total)
            }
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
            console.log(err)
        })
}