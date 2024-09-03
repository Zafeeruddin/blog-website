import axios from "axios";

async function fetchUrl(blogId:string, method: "PUT" | "GET") {
    const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/user/pre-signed-url",{withCredentials:true,headers:{"blogId":blogId,"method":method}})
    const url = response.data
    return url;
}

export  const putImage = async (blogId:string,file:File)=>{
    const url = await fetchUrl(blogId,"PUT");
    const response = await axios.put(url,file,{
        headers:{
            "Content-Type":file.name
        }
    })
    if (response.status===200){
        return url
    }

}

export const getImage = async (blogId:string):(Promise<string | undefined>)=>{
    const url = await fetchUrl(blogId,"GET")
    try{
        const response = await axios.get(url,{
            headers:{
                "Content-Type":blogId
            }
        })
        if (response.status===200){
            const response = await axios.get(url, { responseType: 'arraybuffer' });

        if (response.status === 200) {
            // Convert the image data to a Blob object
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // Create an object URL for the image
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } else {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        }
    }catch(e){
        console.log("Error fetching image", e)
    }
}
