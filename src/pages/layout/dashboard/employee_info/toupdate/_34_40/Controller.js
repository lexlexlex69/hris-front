import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getOtherItemsUpdates = (id, item, setItem, setUpdates,setLoader,controller) => {
    axios.post(`/api/pds/others/getOtherItemsUpdates`, { id: id }, { signal: controller.signal })
      .then(res => {
        Swal.close()
        // console.log(res)
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
        setUpdates(res.data.updates)
        setLoader(true)
      })
      .catch(err => {
        Swal.close()
        setLoader(true)
        toast.error(err.message)
      })
  }