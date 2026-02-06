import { Toast } from "react-native-toast-notifications";

const WarningMessage = (message) => {
    Toast.show(message, {
        type: "warning",
        placement: "top",
        animationType: "slide-in",
    });
}

export default WarningMessage