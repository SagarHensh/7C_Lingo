export function hourChange(hour) {
    try {
        hour = parseInt(hour);
        if (hour < 12) {
            if (hour < 9) {
                hour = hour + 1;
                hour = "0" + String(hour);
            } else {
                hour = hour + 1;
            }
        } else {
            hour = "01";
        }
        return String(hour);
    } catch (err) {
        console.log(err)
    }
}
export function hourReversChange(hour) {
    try {
        hour = parseInt(hour);
        if (hour > 0) {
            if (hour < 11) {
                hour = hour - 1;
                if (hour == 0) {
                    hour = "12";
                } else {
                    hour = "0" + String(hour);
                }
            } else {
                hour = hour - 1;
            }
        } else {
            hour = "12";
        }
        return String(hour);
    } catch (err) {
        console.log(err)
    }
}

export function minutesChange(minute) {
    try {
        minute = parseInt(minute);
        if (minute < 59) {
            if (minute < 9) {
                minute = minute + 1;
                minute = "0" + String(minute);
            } else {
                minute = minute + 1;
            }
        } else {
            minute = "00";
        }
        return String(minute);
    } catch (err) {
        console.log(err)
    }
}

export function minutesReversChange(minute) {
    try {
        minute = parseInt(minute);
        if (minute > 0) {
            if (minute < 11) {
                minute = minute - 1;
                if (minute == 0) {
                    minute = "00"
                } else {
                    minute = "0" + String(minute);
                }
            } else {
                minute = minute - 1;
            }
        } else {
            minute = "59";
        }
        return String(minute);
    } catch (err) {
        console.log(err)
    }
}

export function amPmChange(data) {
    try {
        if (data == "AM") {
            data = "PM"
        } else {
            data = "AM"
        }
        return data;
    } catch (err) {
        console.log(err)
    }
}
