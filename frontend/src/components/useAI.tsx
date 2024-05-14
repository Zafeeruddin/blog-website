// import axios from "axios"

// const useAI=({prompt}:any)=>{

//     const getResponse=async()=>{

//         const headers={
//             headers:{
//                 'Content-Type':"application/json",
//                 "Authorizaion":`Bearer ${API_KEY}`
//             }
//         }

//         const data={
//             prompt:prompt,
//             max_tokens:50,
//             temperature:0.7
//         }

//         try{
//             const response=await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions",{prompt:prompt,
//             max_tokens:50,
//             temperature:0.7},headers)
//             const data=response.data.choices[0].text
//             console.log(data)
//         }catch(e){
//             console.log(e)
//         }
//     }
//     return (
//         <>
//             <div>
//                 <div>
                    
//                 </div>
//                 <div>

//                 </div>
//             </div>
//         </>
//     )
// }