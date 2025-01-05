import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

// below functions are for global use for pds modules

export const checkChangedInputs = (defaultValue, refValue, isEmail) => {
    // e test pani
    if (defaultValue === '' && refValue === '' || defaultValue === null && refValue === null || defaultValue === '' && refValue === null || defaultValue === null && refValue === '')
        return undefined
    if (defaultValue && refValue === '' || defaultValue && refValue === null)
        return undefined
    if (defaultValue && refValue === ' ')
        return undefined
    if (defaultValue === '' && refValue || defaultValue === null && refValue)
        return refValue + '*_*' + ''
    if (defaultValue && refValue === '' || defaultValue && refValue === null)
        return '' + '*_*' + defaultValue
    if (defaultValue !== refValue) {
        if (isEmail) {
            return refValue + '*_*' + defaultValue
        }
        return refValue?.toUpperCase() + '*_*' + defaultValue?.toUpperCase()
    }
}

export const filterFalsyValues = (filterFalsyValuesObj) => { // to filter object properties with undefined values
    return Object.entries(filterFalsyValuesObj).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
}

// function used for multiple file upload
const converterr = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = error => reject(error);
    });
}

// test file converter for multiple file upload
export const convertTo64ed = (file) => { // converter for file to base 64 string
    let temp = ''
    let promises = Object.values(file).map(async (x, i) => await converterr(x))
    return new Promise((resolve, reject) => {
        Promise.all(promises).then(res => {
            res.map((x, i) => {
                let delimeter = i === res.length - 1 ? '' : '*_____*'
                temp = temp + x + delimeter
            })
            resolve(temp)
        })
    })
}

export const convertTo64 = (file) => { // converter for file to base 64 string
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = error => reject(error);
    });
}

export const handleViewFile = (id, url) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/${url}`, {
        id: id
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleViewToAddFile = (file) => { // to show added item with files
    let contentType = file.split(';')
    contentType = contentType[0].split(':') // take file mimetype in base64 string
    const byteCharacters = atob(file.substr(`data:${contentType[1]};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType[1] });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
}

// test handle view table file for multiple files
export const handleViewFile2 = (id, url, filename) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/${url}`, {
        id: id,
        filename: filename
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

// test handle view added for multiple files
export const handleViewAddedFile2 = (id, url, filename) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/${url}`, {
        id: id,
        filename: filename,
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleViewAddedFile = (id, url) => { // when view attach file is clicked,
    Swal.fire('Processing request . . .')
    Swal.showLoading()
    axios.post(`/api/pds/${url}`, {
        id: id
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const viewFilesUsingPathOnly = (path, url, method) => {
    Swal.fire('Processing request . . .')
    Swal.showLoading()

    axios.post(url, {
        path: path
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })

}

// custom frontend pagination
export const handlePaginationChangeFunction = (value, setPage, data, setData, setTableData, perPage) => {
    let newValue = (value - 1) * perPage
    let newLimit = value * perPage
    let newArr = data.slice(newValue, newLimit)
    setPage(value)
    setTableData(newArr)
};

const ones = (num) => {
    if (num === 1)
        return 'One'
    if (num === 2)
        return 'Two'
    if (num === 3)
        return 'Three'
    if (num === 4)
        return 'Four'
    if (num === 5)
        return 'Five'
    if (num === 6)
        return 'Six'
    if (num === 7)
        return 'Seven'
    if (num === 8)
        return 'Eight'
    if (num === 9)
        return 'Nine'
}

const tens = (num) => {
    if (num === 11)
        return 'Eleven'
    if (num === 12)
        return 'Twelve'
    if (num === 13)
        return 'Thirtheen'
    if (num === 14)
        return 'Fourteen'
    if (num === 15)
        return 'Fifteen'
    if (num === 16)
        return 'Sixteen'
    if (num === 17)
        return 'Seventeen'
    if (num === 18)
        return 'Eighteen'
    if (num === 19)
        return 'Nineteen'
}

const twens = (num) => {
    if (num === 1)
        return ''
    if (num === 2)
        return 'Twenty'
    if (num === 3)
        return 'Thirty'
    if (num === 4)
        return 'Fourty'
    if (num === 5)
        return 'Fifty'
    if (num === 6)
        return 'Sixty'
    if (num === 7)
        return 'Seventy'
    if (num === 8)
        return 'Eighty'
    if (num === 9)
        return 'Ninety'
}

export const calculateSalaryToWord = (num) => {
    num = num?.toString()
    let rev = []
    for (let i = num.length - 1; i >= 0; i--) {
        rev.push(Number(num[i]))
    }
    let len = rev.length - 1
    let ress = ''
    while (len >= 0) {
        if (len === 8) {
            ress = ress + ' ' + ones(rev[len]) + ' Hundred '
        }
        if (len === 7 && rev[len] !== 1) {
            ress = ress + ' ' + twens(rev[len])
        }
        if (len === 7 && rev[len] === 1) {
            ress = ress + ' ' + tens((rev[len] * 10 + rev[len - 1])) + ' Million '
            len = len - 2
        }
        if (len === 6) {
            ress = ress + ' ' + ones(rev[len]) + ' Million '
        }
        if (len === 5) {
            ress = ress + ' ' + ones(rev[len]) + ' Hundred '
        }
        if (len === 4 && rev[len] !== 1) {
            ress = ress + ' ' + twens(rev[len])
        }
        if (len === 4 && rev[len] === 1) {
            ress = ress + ' ' + tens((rev[len] * 10 + rev[len - 1])) + ' Thousand '
            len = len - 2
        }
        if (len === 3) {
            ress = ress + ' ' + ones(rev[len]) + ' Thousand '
        }
        if (len === 2) {
            ress = ress + ' ' + ones(rev[len]) + ' Hundred '
        }
        if (len === 1 && rev[len] !== 1) {
            ress = ress + ' ' + twens(rev[len])
        }
        if (len === 1 && rev[len] === 1) {
            ress = ress + ' ' + tens((rev[len] * 10 + rev[len - 1]))
            break
        }
        if (len === 0) {
            ress = ress + ' ' + ones(rev[len])
        }
        len--
    }
    return ress
}

