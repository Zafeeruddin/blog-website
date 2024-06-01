import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import { RecoilRoot, useRecoilValue } from "recoil";
import Signin from "./pages/Signin";
import { Blogs } from "./pages/Blogs";
import { OpenBlog } from "./pages/OpenBlog";
import { blogOpen } from "./store/atoms/post";
import { Suspense } from "react";
import BlogStats from "./pages/stats";
import { Toaster } from "sonner";
import { Write } from "./pages/Write";
import { FilteredPosts } from "./pages/FilteredPosts";
import { SearchBlogs } from "./pages/Search";

export default function App(){
  const blog=useRecoilValue(blogOpen)
  console.log("open blog in app",blog)
  return (
    <>
      <BrowserRouter>
      <Toaster richColors/>
        <RecoilRoot>
          <Routes>
            <Route path="/stats" element={<BlogStats/>}/>
            <Route path="/" element={<Signup/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/blogs" element={<Suspense fallback={<div>loading...</div>}><Blogs/></Suspense>}/>
            <Route path={`blogs/:id`} element={<OpenBlog />} />
            <Route path="/write" element={<Write/>}/>
            <Route path="/filteredBlogs" element={<FilteredPosts/>}/>
            <Route path="/search" element={<SearchBlogs/>}/>
            {/* <Route path="/comments" element={<Comments/>}></Route> */}
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  )
}