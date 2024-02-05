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
};

// type checkUserType = {
//   acknowledged: boolean;
// };

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
        // // API to check user
        // const checkUserAPI = `${API}/checkuser`;

        // fetch(checkUserAPI, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     user_id: parsedUser.user_id,
        //     email: parsedUser.email,
        //   }),
        // })
        //   .then((res) => res.json() as Promise<checkUserType>)
        //   .then((data: checkUserType) => {
        //     if (!data.acknowledged) {
        //       localStorage.removeItem("horizonUser");
        //       if (
        //         currentPath !== "/login" &&
        //         currentPath !== "/register" &&
        //         currentPath !== "/forgot"
        //       ) {
        //         navigate("/", { replace: true });
        //       }

        //     }
        //   })
        //   .catch(() => console.log());
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
