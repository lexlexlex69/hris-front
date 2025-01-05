import axios from 'axios'
import { toast } from 'react-toastify'

export const getAllPositions = async (controller, setPositions, setLoader, page, setTotal, filters) => {
   setLoader(true)
   try {
      let positions = await axios.get(`/api/recruitment/getAllPositions${page ? '?page=' + page : ''}${filters && filters.position_name ? `&position_name=${filters.position_name}` : ''}${filters && filters.date_from ? `&date_from=${filters.date_from}` : ''}${filters && filters.date_to ? `&date_to=${filters.date_to}` : ''}`, {}, { signal: controller.signal })
      setLoader(false)
      if (positions.data.status === 200) {
         setPositions(positions.data.positions.data)
         setTotal(positions.data.positions.total)
      }
      else {
         toast.error('Error')
      }
   }
   catch (err) {
      toast.error(err.message)
   }
}