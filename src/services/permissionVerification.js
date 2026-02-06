const permission_ver = (list, page, name) => {

    let answer = false
    
    if (list == null) {
        answer = true
    } else {
        if (list[page]) {
            if (list[page][name]) {
                if (list[page][name] != "3") {
                    answer = true
                }
            } else {
                answer = false;
            }
        } else {
            answer = true;
        }
    }

    return answer;
}

export default permission_ver;