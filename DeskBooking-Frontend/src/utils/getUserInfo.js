export const getUserInfo = async () => {
  try {
    const resp = await fetch("/api/userinfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.ok) {
      const user = await resp.json();
      return user;
    }

    return null;
  } catch {
    return null;
  }
};
