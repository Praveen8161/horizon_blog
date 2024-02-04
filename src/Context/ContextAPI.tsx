import { createContext, useContext, useEffect, useState } from "react";
import { StaffPickData } from "../helpers/Data.ts";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { user } from "../helpers/Types.ts";

type blogDataType = {
  blogData: typeof StaffPickData;
  setBlogData: React.Dispatch<React.SetStateAction<typeof StaffPickData>>;
  loggedUser: user;
  setLoggedUser: React.Dispatch<React.SetStateAction<user>>;
};

// type checkUserType = {
//   acknowledged: boolean;
// };

const blogDataContext = createContext<blogDataType | null>(null);

const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  const [blogData, setBlogData] = useState(StaffPickData);

  const [loggedUser, setLoggedUser] = useState<user>({
    user_id: 0,
    email: "",
    user_name: "",
    token: "",
  });

  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const paths: string[] = ["/login", "/register", "/forgot"];

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
      if (!paths.includes(currentPath)) {
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
