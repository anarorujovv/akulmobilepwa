import { toast } from 'react-toastify';

const WarningMessage = (message) => {
    toast.warn(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

export default WarningMessage;