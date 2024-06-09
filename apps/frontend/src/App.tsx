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
import { Home } from "./pages/Home";
import ProtectedRoute from "./components/Protected";

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
            <Route path="/home" element={<ProtectedRoute>  <Home/></ProtectedRoute>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/blogs" element={<ProtectedRoute><Suspense fallback={<div>loading...</div>}><Blogs/></Suspense></ProtectedRoute>}/>
            <Route path={`blogs/:id`} element={<ProtectedRoute><OpenBlog /></ProtectedRoute>} />
            <Route path="/write" element={<ProtectedRoute><Write/></ProtectedRoute>}/>
            <Route path="/filteredBlogs" element={<ProtectedRoute><FilteredPosts/></ProtectedRoute>}/>
            <Route path="/search" element={<ProtectedRoute><SearchBlogs/></ProtectedRoute>}/>
            {/* <Route path="/comments" element={<Comments/>}></Route> */}
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  )
}