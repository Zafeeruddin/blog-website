import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

async function fetchUrl(blogId:string, method: "PUT" | "GET") {
    const command = method ==="GET" ? new GetObjectCommand({Bucket:"blog",Key:`blog/${blogId}`}) :
                                      new PutObjectCommand({ Bucket:"blog", Key:`blog/${blogId}`})

    if (!process.env.secretAccessKey || !process.env.ACCESS_KEY_ID || !process.env.endpoint) {
       throw new Error("Missing necessary environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, or endpoint.");
    }
    const S3 = new S3Client({
        endpoint: process.env.endpoint,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.secretAccessKey,
        },
        region: "auto",
    });

    
    const url = await getSignedUrl(
        S3,
        command
    )
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
}
