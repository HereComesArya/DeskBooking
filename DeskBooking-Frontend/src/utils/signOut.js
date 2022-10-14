export const signOut = async (cb) => {
    try {
      const resp = await fetch("/api/signout", {
        method: "POST",
      });
  
      if (resp.ok) {
        cb();
        return user.name;
      }
  
      return null;
    } catch {
      return null;
    }
  };