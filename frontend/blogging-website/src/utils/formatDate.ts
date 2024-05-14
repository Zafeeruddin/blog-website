import { Dispatch, SetStateAction } from "react";

export const formatDate=(date:Date,setDuration:Dispatch<SetStateAction<string>>)=>{
        const newDate=new Date();
        const oldDate=new Date(date)
        const start=oldDate.getTime()
        const end=newDate.getTime()
        const differenceMs = Math.abs(end-start);
        // Convert milliseconds to days, months, and years
        const seconds = Math.floor(differenceMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            setDuration(years + (years === 1 ? " year" : " years"));
        } else if (months > 0) {
            setDuration(months + (months === 1 ? " month" : " months"));
        } else if (days>0){
            setDuration(days + (days === 1 ? " day" : " days"));
        } else if (hours>0){
            setDuration(hours + (hours === 1 ? " hour" : " hours"))
        } else if (minutes){
            setDuration(minutes + (minutes === 1 ? " minute" : " minutes"))
        } else{
            setDuration("now")
        }
}