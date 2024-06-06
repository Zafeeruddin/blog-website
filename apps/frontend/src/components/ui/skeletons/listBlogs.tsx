export 
const ListBlogs=()=>{
    return (
        
<div role="status" className="max-w-md p-4 ml-20 mt-20 w-2/3 space-y-4  divide-y divide-gray-200  animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
    <div className="flex items-center justify-between">
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div className="rounded-full h-4 w-4"></div>
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <span className="sr-only">Loading...</span>
</div>

    )
}

export const List=()=>{
    return (
    <>
        <Skeleton/>
        <Skeleton/>
        <Skeleton/>
        <Skeleton/>
    </>
    )
}

const Skeleton =()=>{
    return (
        <div className="lg:m-12 lg:pr-20 lg:pl-20 md:m-10 md:pr-20 md:pl-20 m-2 mb-4 mt-8 border-b pb-4 animate-pulse" >
        <div className="mb-4 flex items-center space-x-4">
            <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center"> 
                <span className="uppercase"></span>
            </div>
            <div className="font-serif text-lg text-slate-950 rounded-md bg-slate-400 w-28 h-4"></div>
            <div className="flex justify-center content-center mb-2 text-gray-400">.</div>
            <div className="text-gray-400 rounded-l bg-slate-200 w-48 h-4"></div>
        </div>
        <div className="flex ">
            <div className="w-2/3">
                <div className="pb-3 font-bold  text-sm text-black lg:text-xl cursor-pointer rounded-lg bg-slate-900 w-96 h-2" ></div>
                <p className="text-sm lg:text-lg text-gray-400"> </p>
                <div className="flex space-x-8">
                    <div className="text-gray-400 text-sm"></div>
                </div>
            </div>
        </div>
    </div>
    )
}