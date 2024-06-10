export const OpenBlogSkeleton=()=>{
    return (
        <>
            <div className="p-4 lg:p-16 lg:pl-80 lg:pr-80 md:p-20 -z-10 animate-pulse">
                <div className="text-4xl md:text-2xl lg:text-5xl font-serif font-bold mb-10 text-slate-950 "></div>
                <div className="mb-4  flex items-center space-x-4 pb-10 border-b">
                        <div className="bg-gray-500 text-white rounded-full h-16 w-16 text-4xl flex items-center justify-center "> 
                            <span className="uppercase"></span>
                        </div>
                        <div>
                            <div className="font-sans text-lg text-slate-950 capitalize w-32 h-2 bg-gray-200 rounded-full"></div>
                            <div className="flex">
                                <div className="text-gray-400 text-sm w-32 h-2 bg-gray-200 rounded-full"></div>
                                <div className="flex justify-center content-center ml-4 mb-2 w-32 h-2 bg-gray-200 rounded-full">.</div>
                                <div className="text-gray-400 ml-4 text-sm w-32 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        <div  className="cursor-pointer space-y-1 flex space-x-2 w-32 h-2 bg-gray-200 rounded-full">
                            <div></div>
                            <div> </div>
                        </div>
                        <div  className="cursor-pointer"></div>
                </div>
            
            </div>
        </>
    )
}

