export function formatObjectKey(obj) {
    if (obj) {
        var keys = Object.keys(obj);
        var n = keys.length;
        
        while (n--) {
            var key = keys[n];
            if (key !== key.toLowerCase()) {
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        }
        return obj;
    } else return null;
} 