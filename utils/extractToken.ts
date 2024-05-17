export function extractAccessToken(cookieString:any,key:string) {
    let accessToken = null;
  
    // Split the cookie string by semicolons to separate individual cookies
    const cookies = cookieString.split('; ');
  
    // Iterate over each cookie to find the FLYAccessToken
    cookies.forEach((cookie: { split: (arg0: string) => [any, any]; }) => {
      // Split each cookie by '=' to separate cookie name and value
      const [name, value] = cookie.split('=');
  
      // Check if the cookie name is FLYAccessToken
      if (name === key) {
        accessToken = value;
      }
    });
  
    return accessToken;
  }