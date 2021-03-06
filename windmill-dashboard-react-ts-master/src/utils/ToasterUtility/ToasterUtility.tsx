
import { toast } from 'react-toastify';

export const showToastSuccess = (msg: string) => {
    toast.dismiss()
    toast.success(msg, {
        position: toast.POSITION.BOTTOM_LEFT
    });
}

export const showToastError = (msg: string) => {
    toast.dismiss()
    toast.error(msg, {
        position: toast.POSITION.BOTTOM_LEFT
    });
}

