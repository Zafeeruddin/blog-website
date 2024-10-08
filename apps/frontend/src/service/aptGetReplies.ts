import axios from "axios";
import { SetterOrUpdater} from "recoil";
import { Reply } from "../utils/types";



export const fetchReplies = async (token:string,commentId:string,setCurrentReplies:SetterOrUpdater<Reply[]>) => {
    try {
        const headers = {
            "Authorization": token,
            "id": commentId
        };
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/post/replies`, {withCredentials:true,headers:headers});
        if (!Array.isArray(response.data)) {
            return;
        }
        setCurrentReplies(response.data);
        console.log("replies", response.data);
    } catch (error) {
        console.error("Error fetching replies:", error);
    }
};

