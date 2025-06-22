// AppRoutes.jsx
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/customUI/Loader";
import { About } from "./pages/static/About";
import { Contact } from "./pages/static/Contact";
import { Landing } from "./pages/main/Landing";
import { Home3d } from "./pages/mod3d/Home3d";
import { Profile } from "./pages/main/Profile";
import { ViewMod3d } from "./pages/mod3d/ViewMod3d";
import { UploadMod3d } from "./pages/mod3d/UploadMod3d";
import { Layout } from "./components/layout/Layout";
import { UserModels } from "./pages/user/UserModels";
import { Home } from "./pages/main/Home";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ComingSoon } from "./pages/ComingSoon";
import { PostPage } from "./pages/main/PostPage";
import { EditMod3d } from "./pages/mod3d/EditMod3d";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/main/Feed";
import ViewPost from "./pages/main/ViewPost";

export function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Router>
      <Toaster richColors position="top-center" duration={2000} closeButton />
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/home3d" element={<Home3d />} />
          <Route path="/viewmod3d/:id" element={<ViewMod3d />} />
          <Route path="/auth" element={<Landing />} />
          <Route path="/viewpost/:id" element={<ViewPost />} />
          <Route
            path="/blogs"
            element={
              <ComingSoon
                title="Blogs Coming Soon"
                message="BukWarm is bringing stories to life. Stay tuned!"
              />
            }
          />
          <Route
            path="/graphics"
            element={
              <ComingSoon
                title="Graphics Coming Soon"
                message="BukWarm is bringing stories to life. Stay tuned!"
              />
            }
          />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/uploadmod3d" element={<UploadMod3d />} />
            <Route path="/user/:id" element={<UserModels />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditMod3d />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
