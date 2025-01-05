import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const customSorting = (param, data, column, setState) => {
    if (typeof (param) === 'string') {
        let dumData = [...data]
        switch (param) {
            case 'asc': {
                dumData.sort((a, b) => (a[column] > b[column]) ? 1 : -1)
                setState(dumData)
                break
            }
            case 'desc': {
                dumData.sort((a, b) => (b[column] < a[column]) ? -1 : 1)
                setState(dumData)
                break
            }
            default: return
        }

    }
    if (typeof (param) === 'object') {
        let dumData = [...data]
        switch (param.order) {
            case 'asc': {
                dumData.sort((a, b) => Number(a[column]) - Number(b[column]))
                setState(dumData)
                break
            }

            case 'desc': {
                dumData.sort((a, b) => Number(b[column]) - Number(a[column]))
                setState(dumData)
                break
            }

            default: return
        }
    }
}
