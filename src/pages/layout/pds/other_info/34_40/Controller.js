import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import { filterFalsyValues, checkChangedInputs } from '../../customFunctions/CustomFunctions'

export const getOtherItems = (id, item, setItem, setDefaultItems, setState) => {
  axios.post(`/api/pds/others/getOtherItems`, { id: id })
    .then(res => {
      if (res.data.status === 200) {
        setState(true)
        if (res.data.other_items.length > 0) {
          let newArr = []
          let obj = res.data.other_items.reduce(function (acc, cur, i) {
            acc['_' + cur.item + '_' + cur.tag] = cur;
            return acc;
          }, {});
          res.data.other_items.map(async (item) => {
            newArr.push({
              item: item.item,
              tag: item.tag,
              value: item.value,
              specify: item.specify,
              specify2: item.specify2,
            })
          })
          let tempObj = { // temporary object, will be used to compare the actual returned obj from api
            _34_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 34,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _34_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 34,
              specify: '',
              specify2: null,
              tag: "b",
              value: 0
            },
            _35_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 35,
              specify: '',
              specify2: '',
              tag: "a",
              value: 0
            },
            _35_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 35,
              specify: '',
              specify2: null,
              tag: "b",
              value: 0
            },
            _36_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 36,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _37_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 37,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _38_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 38,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _38_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 38,
              specify: '',
              specify2: null,
              tag: "b",
              value: 0
            },
            _39_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 39,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _40_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: '',
              specify2: null,
              tag: "a",
              value: 0
            },
            _40_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: '',
              specify2: null,
              tag: "b",
              value: 0
            },
            _40_c: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: '',
              specify2: null,
              tag: "c",
              value: 0
            }
          }
          Object.keys(obj).map(item => { // if temporary object has same keys as the actual returned api, that object will be replace by the actual, then assign this to be the actual object to setItem
            Object.keys(tempObj).map(items => {
              if (item === items) {
                tempObj[items] = obj[item]
              }
            })
          })
          let defaultItems = [ // temporary setter for default values
          { item: 34, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 34, tag: 'b', value: 0, specify: '', specify2: '' },
          { item: 35, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 35, tag: 'b', value: 0, specify: '', specify2: '' },
          { item: 36, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 37, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 38, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 38, tag: 'b', value: 0, specify: '', specify2: '' },
          { item: 39, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 40, tag: 'a', value: 0, specify: '', specify2: '' },
          { item: 40, tag: 'b', value: 0, specify: '', specify2: '' },
          { item: 40, tag: 'c', value: 0, specify: '', specify2: '' },
        ]
        res.data.other_items.map((item) => {
          defaultItems.map((items => {
              if(item.item === items.item && item.tag === items.tag){
                items.value = item.value
                items.specify = item.specify
                items.specify2 = item.specify2
              }
          }))
        })
          setItem(tempObj)
          setDefaultItems(defaultItems)
        }
        else {
          setDefaultItems([ // temporary setter for default values if data return from api is empty
            { item: 34, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 34, tag: 'b', value: '', specify: '', specify2: '' },
            { item: 35, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 35, tag: 'b', value: '', specify: '', specify2: '' },
            { item: 36, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 37, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 38, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 38, tag: 'b', value: '', specify: '', specify2: '' },
            { item: 39, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 40, tag: 'a', value: '', specify: '', specify2: '' },
            { item: 40, tag: 'b', value: '', specify: '', specify2: '' },
            { item: 40, tag: 'c', value: '', specify: '', specify2: '' },
          ])
          setItem({ // if return data from api is empty, manual set the Items
            _34_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 34,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _34_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 34,
              specify: 'N/A',
              specify2: null,
              tag: "b",
              value: 0
            },
            _35_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 35,
              specify: 'N/A',
              specify2: 'N/A',
              tag: "a",
              value: 0
            },
            _35_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 35,
              specify: 'N/A',
              specify2: null,
              tag: "b",
              value: 0
            },
            _36_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 36,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _37_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 37,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _38_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 38,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _38_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 38,
              specify: 'N/A',
              specify2: null,
              tag: "b",
              value: 0
            },
            _39_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 39,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _40_a: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: 'N/A',
              specify2: null,
              tag: "a",
              value: 0
            },
            _40_b: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: 'N/A',
              specify2: null,
              tag: "b",
              value: 0
            },
            _40_c: {
              employee_id: res.data.employee_id,
              id: 1,
              item: 40,
              specify: 'N/A',
              specify2: null,
              tag: "c",
              value: 0
            }
          })
        }

      }

    })
    .catch(err => {
      setState(false)
      toast.error(err.message)
    })
}

export const getOtherItemsUpdates = (id, item, setItem, setDefaultItems, setState, setUpdates) => {
  axios.post(`/api/pds/others/getOtherItemsUpdates`, { id: id })
    .then(res => {
      Swal.close()
      setState(true)
      let newArr = []
      let obj = res.data.other_items.reduce(function (acc, cur, i) {
        acc['_' + cur.item + '_' + cur.tag] = cur;
        return acc;
      }, {});

      res.data.other_items.map(async (item) => {
        newArr.push({
          item: item.item,
          tag: item.tag,
          value: item.value,
          specify: item.specify,
          specify2: item.specify2,
        })
      })
      setItem(obj)
      setDefaultItems(newArr)
      setUpdates(res.data.updates)
    })
    .catch(err => {
      Swal.close()
      setState(false)
    })
}

export const handleChangeItem = (value, item, state, items, setItems) => {
  let newState = items[item]
  if (newState.value !== value) {
    newState.value = Number(value)
    setItems({ ...items, [item]: newState })
  }
}

export const handleChangeItemText = (value, item, state, items, setItems, type) => {
  let newState = items[item]
  if (type === 1) {
    newState.specify = value
  }
  else if (type === 2) {
    newState.specify2 = value
  }
  setItems({ ...items, [item]: newState })
}

export const handleSubmit = (newItems, defaultItems) => {
  let itemObjToArray = []
  Object.values(newItems).map(x => {
    defaultItems.map(y => {
      if (x.item === y.item && x.tag === y.tag) {
        if (x.value !== y.value) {
          itemObjToArray.push({
            employee_id: x.employee_id,
            table_field: 'value',
            row_index: '_' + x.item + '_' + x.tag,
            old_value: y.value,
            new_value: x.value
          })
        }
        if (x.specify !== y.specify) {
          itemObjToArray.push({
            employee_id: x.employee_id,
            table_field: 'specify',
            row_index: '_' + x.item + '_' + x.tag,
            old_value: y.specify,
            new_value: x.specify
          })
        }
        if (x.specify2 !== y.specify2) {
          itemObjToArray.push({
            employee_id: x.employee_id,
            table_field: 'specify2',
            row_index: '_' + x.item + '_' + x.tag,
            old_value: y.specify2,
            new_value: x.specify2
          })
        }
      }
    })
  })
  // console.log(itemObjToArray)
  if(itemObjToArray.length <= 0)
  {
    toast.warning('Nothing to update/wait for your updates to be approved!')
    Swal.close()
    return 
  }
  Swal.fire({
    title:'submitting updates . . . ',
    icon: 'info',
    allowOutsideClick: false,
  })
  Swal.showLoading()
  axios.post(`/api/pds/others/updateOtherItems`, { data: itemObjToArray }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => {
      if (res.data.status === 200) {
        Swal.close()
        toast.success('Changes added! please wait for the confirmation.')
      }
      // console.log(res)
    })
    .catch(err => {
      Swal.close()
      toast.error('Something went wrong!')
      // console.log(err)
    })
}