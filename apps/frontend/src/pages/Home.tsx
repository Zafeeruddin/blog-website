import { useRecoilState,  } from "recoil"
import { Layout } from "../components/ui/layout"
import { isSearch,  } from "../store/atoms/user"
import { Blogs } from "./Blogs"
import { SearchBlogs } from "./Search"

export const Home=()=>{
    const [isSearchBlog,]=useRecoilState(isSearch)
    
    return (
        <>
            <Layout/>
            {!isSearchBlog ? <Blogs/> : <SearchBlogs/>}
        </>
    )
}