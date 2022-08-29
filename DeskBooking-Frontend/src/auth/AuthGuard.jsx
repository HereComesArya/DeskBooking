import {React, useContext, useLocation} from 'react';
import {getUserInfo} from "../utils/getUserInfo";
import {UserContext} from "../app"
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

export default AuthGuard;
