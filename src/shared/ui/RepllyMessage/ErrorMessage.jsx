import { Toast } from "react-native-toast-notifications";

const ErrorMessage = (message) => {
    Toast.show(message, {
        type: "danger",
        placement: "top",
        animationType: "slide-in",
    });
}

export default ErrorMessage