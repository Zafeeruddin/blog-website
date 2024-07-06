import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import { RecoilRoot } from "recoil";
import Signin from "./pages/Signin";
import { Blogs } from "./pages/Blogs";
import { OpenBlog } from "./pages/OpenBlog";
import { Suspense } from "react";
import BlogStats from "./pages/stats";
import { Toaster } from "sonner";
import { Write } from "./pages/Write";
import { FilteredPosts } from "./pages/FilteredPosts";
import { SearchBlogs } from "./pages/Search";
import ProtectedRoute from "./components/Protected";
import { Layout } from "./components/ui/layout";
// import { isAuthenticated } from "./store/atoms/user";

export default function App(){
  // const auth= useRecoilValue(isAuthenticated)
  return (
    <>
      <BrowserRouter>
      <Toaster richColors/>
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/blogs" element={<Suspense fallback={<div>loading...</div>}><Blogs /></Suspense>} />
              <Route path="/blogs/:id" element={<Suspense fallback={<div>loading...</div>}><OpenBlog /></Suspense>} />
              <Route path="/filteredBlogs" element={<FilteredPosts />} />
              <Route path="/search" element={<SearchBlogs />} />
            </Route>
            <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
            <Route path="/stats" element={<BlogStats />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  )
}