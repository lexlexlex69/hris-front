import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';

export const handleFinishStep = async(setStep) => {
    try{
        let doneBasicPds = await axios.post(`/api/recruitment/qs/doneQsBasics`)
        console.log(doneBasicPds)
        if(doneBasicPds.data.status === 200)
        {

        }
        if(doneBasicPds.data.status === 500)
        {
            
        }
    }
    catch(err){
        toast.error(err.message)
    }

}