function getTimeSpend(time){
    time = (+time) / 1000;
    time = (~~time);
    if(time < 60)
        return time;
    var sec = time % 60;
    time /= 60;
    time = (~~time);
    if(time < 60)
        return time+","+sec;
    var min = time % 60;
    time /= 60;
    time = (~~time);
    return ""+time+","+min+","+sec;
}

function getTimeString(timeParts){
    var formattedTime = "";
    var time = timeParts.split(",");
    if(time.length === 3){
        formattedTime = time[0]+"h "+time[1]+"m "+time[2]+"s";
    }
    else if(time.length === 2){
        formattedTime = time[0]+"m "+time[1]+"s";
    }
    else if(time.length === 1){
        formattedTime = time[0]+"s";
    }
    return formattedTime;
}