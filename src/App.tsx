import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import HomePage from "./Pages/HomePage";
import Profile from "./Pages/Profile";
import WriteBlog from "./Pages/WriteBlog";
import UserBlogs from "./Pages/UserBlogs";
import ShowBlog from "./Pages/ShowBlog";
import EditBlog from "./Pages/EditBlog";
import ExamplePages from "./Pages/ExamplePages";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/write" element={<WriteBlog />} />
        <Route path="/userblog" element={<UserBlogs />} />
        <Route path="/showblog/:id" element={<ShowBlog />} />
        <Route path="/edit" element={<EditBlog />} />
        <Route path="/staffpick" element={<ExamplePages />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default App;
