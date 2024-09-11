import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import { RecoilRoot, useRecoilValue } from "recoil";
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
import OTPActivation from "./pages/OtpActivate";
import { Myblogs } from "./pages/Myblogs";
import { isAuthenticated } from "./store/atoms/user";

const AuthRouter = () => {
  const auth = useRecoilValue(isAuthenticated);
  return auth ? <Navigate to="/blogs" replace /> : <Navigate to="/signin" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<AuthRouter />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="blogs" element={<Suspense fallback={<div>loading...</div>}><Blogs /></Suspense>} />
            <Route path="blogs/:id" element={<Suspense fallback={<div>loading...</div>}><OpenBlog /></Suspense>} />
            <Route path="filteredBlogs" element={<FilteredPosts />} />
            <Route path="search" element={<SearchBlogs />} />
            <Route path="myblogs" element={<Myblogs />} />
            <Route path="write" element={<Write />} />
            <Route path="stats" element={<BlogStats />} />
          </Route>

          <Route path="/otp" element={<OTPActivation />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  );
}