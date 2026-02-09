/**
 * Web-compatible prompt function
 * Shows a confirmation dialog to the user
 * @param {string} message - The message to display
 * @param {function} onPress - Callback to execute if user confirms
 */
const prompt = (message, onPress) => {
    // Use native browser confirm dialog
    // Returns true if user clicks OK, false if Cancel
    const confirmed = window.confirm(message);

    if (confirmed && onPress) {
        onPress();
    }
}

export default prompt;