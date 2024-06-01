import { atom } from "recoil";

export const handleNotificationAtom=atom<boolean>({
    key:"notificationHanle",
    default:false
})

export const handleProfileAtom= atom<boolean>({
    key:"profile",
    default:false
})