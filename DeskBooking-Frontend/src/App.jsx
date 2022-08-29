import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { Link, Route, useLocation } from "wouter";
import { getUserInfo } from "./utils/getUserInfo";
import { signOut } from "./utils/signOut";
const UserContext = createContext();
const useCheckAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (user) {   
      return;
    }

    getUserInfo().then((data) => {
      if (data) {
        setUser(data);
        return;
      }

      setUser(null);
      setLocation("/");
      return;
    });
  }, []);

  return user;
};
const AuthGuard = ({ children }) => {
  const user = useCheckAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
      {user ? (
        <>
          <div>
            <Link href="/me">
              <a>Profile</a>
            </Link>
          </div>
          <div>
            <button
              onClick={async () => {
                await signOut(() => {
                  setUser(null);
                  setLocation("/");
                });
              }}
            >
              Signout
            </button>
          </div>
        </>
      ) : (
        <div>
          <a href="/api/signin-google?returnUrl=/me">Login-Google</a>
          <a href="/api/signin-ms?returnUrl=/me">Login-MS</a>
        </div>
      )}

      <Route path="/" component={HomePage}>
        Home
      </Route>

      <Route path="/me">
        <AuthGuard >
          <UserInfoPage />
        </AuthGuard>
      </Route>
    </UserContext.Provider>
  );
};

const HomePage = () => {
  return <div>Home!</div>;
};

const UserInfoPage = () => {
  const {user} = useContext(UserContext);
  console.log(user);
  return <div>Hello, you are logged in!</div>;
};
export {UserContext};
export default App;
