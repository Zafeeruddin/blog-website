import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

async function fetchUrl(blogId:string, method: "PUT" | "GET") {
    const command = method ==="GET" ? new GetObjectCommand({Bucket:"blog",Key:`blog/${blogId}`}) :
                                      new PutObjectCommand({ Bucket:"blog", Key:`blog/${blogId}`})
    const S3 = new S3Client({
        endpoint: "https://cd7ff564fa8b6a378e331b4edae7a57d.r2.cloudflarestorage.com",
        credentials: {
            accessKeyId: "08d2c3c50aa0632c38b09d1b22115800",
            secretAccessKey:
                "580695da00afd83f184b65a478b1933ba651de23c57f4922aadff80d3f47b215",
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
