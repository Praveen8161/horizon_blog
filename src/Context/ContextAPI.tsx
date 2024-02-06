import { createContext, useContext, useEffect, useState } from "react";
import { StaffPickData } from "../helpers/Data.ts";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { singleBlogPostType, user } from "../helpers/Types.ts";

type blogDataType = {
  blogData: typeof StaffPickData;
  setBlogData: React.Dispatch<React.SetStateAction<typeof StaffPickData>>;
  loggedUser: user;
  setLoggedUser: React.Dispatch<React.SetStateAction<user>>;
  selectedBlog: singleBlogPostType;
  setSelectedBlog: React.Dispatch<React.SetStateAction<singleBlogPostType>>;
  userBlogList: singleBlogPostType[];
  setUserBlogList: React.Dispatch<React.SetStateAction<singleBlogPostType[]>>;
  editBlog: singleBlogPostType;
  setEditBlog: React.Dispatch<React.SetStateAction<singleBlogPostType>>;
};

const blogDataContext = createContext<blogDataType | null>(null);

const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  // Hardcoded datas
  const [blogData, setBlogData] = useState(StaffPickData);

  // Logged User Data
  const [loggedUser, setLoggedUser] = useState<user>({
    user_id: 0,
    email: "",
    user_name: "",
    token: "",
  });

  // Single selected user blog
  const [selectedBlog, setSelectedBlog] = useState<singleBlogPostType>({
    blog_id: 0,
    blog_title: "",
    blog_description: "",
    blog_content: "",
    blog_image: null,
    published_date: undefined,
    user_id: 0,
    author: "",
  });

  const [userBlogList, setUserBlogList] = useState<singleBlogPostType[]>([
    {
      blog_id: 0,
      blog_title: "",
      blog_description: "",
      blog_content: "",
      blog_image: null,
      published_date: undefined,
      user_id: 0,
      author: "",
    },
  ]);

  const [editBlog, setEditBlog] = useState<singleBlogPostType>({
    blog_id: 0,
    blog_title: "",
    blog_description: "",
    blog_content: "",
    blog_image: null,
    published_date: undefined,
    user_id: 0,
    author: "",
  });

  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const paths: string[] = ["/login", "/register", "/forgot", "/showblog"];

  useEffect((): void => {
    const userItem: string | null = localStorage.getItem("horizonUser");

    if (userItem) {
      const parsedUser: user | null = JSON.parse(userItem);
      if (
        parsedUser?.email &&
        parsedUser?.user_name &&
        parsedUser?.user_id &&
        parsedUser.email !== loggedUser.email
      ) {
        setLoggedUser(parsedUser);
      }
    } else {
      if (!paths.some((path) => currentPath.startsWith(path))) {
        navigate("/", { replace: true });
        setLoggedUser(() => ({
          user_id: 0,
          email: "",
          user_name: "",
          token: "",
        }));
      }
    }
  }, [currentPath]);

  return (
    <div>
      {blogData && (
        <blogDataContext.Provider
          value={{
            blogData,
            setBlogData,
            loggedUser,
            setLoggedUser,
            selectedBlog,
            setSelectedBlog,
            userBlogList,
            setUserBlogList,
            editBlog,
            setEditBlog,
          }}
        >
          {children}
        </blogDataContext.Provider>
      )}
    </div>
  );
};

export default ContextAPI;

export const BlogState = () => {
  return useContext(blogDataContext);
};
