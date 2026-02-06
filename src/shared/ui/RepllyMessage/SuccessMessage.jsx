import { Toast } from "react-native-toast-notifications";

const SuccessMessage = (message) => {
    Toast.show(message, {
        type: "success",
        placement: "top",
        animationType: "slide-in",
    });
}

export default SuccessMessage