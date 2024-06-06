import AWS from "aws-sdk"
import { env } from "hono/adapter";
import { any } from "zod";
const BUCKET_NAME = "IMAGES_BUCKET";
const s3 = new AWS.S3({});

/**
 * @description Uploads an image to S3
 * @param imageName Image name
 * @param base64Image Image body converted to base 64
 * @param type Image type
 * @return string S3 image URL or error accordingly
 */
export default async function upload(imageName:string, base64Image:string, type:string) {
    const params = {
        Bucket: `${BUCKET_NAME}/images`,
        Key: imageName,
        // @ts-ignore
        Body:new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };

    let data:any;

    try {
        data = await promiseUpload(params);
    } catch (err) {
        console.error(err);

        return "";
    }

    return data.Location;
}
/**
 * @description Promise an upload to S3
 * @param params S3 bucket params
 * @return data/err S3 response object
 */
function promiseUpload(params:any) {
    return new Promise(function (resolve, reject) {
        s3.upload(params, function (err:any, data:any) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

