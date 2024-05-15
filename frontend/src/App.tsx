import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import { RecoilRoot, useRecoilValue } from "recoil";
import Signin from "./components/Signin";
import { Blogs } from "./components/Blogs";
import { OpenBlog } from "./components/OpenBlog";
import { blogOpen } from "./store/atoms/post";
import { WriteBlog } from "./components/WriteBlog";
import { Suspense } from "react";
import BlogStats from "./pages/stats";
import { Toaster } from "sonner";

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
            <Route path="/write" element={<WriteBlog/>}/>
            {/* <Route path="/comments" element={<Comments/>}></Route> */}
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  )
}