"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleSignIn() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        });

        const data = await res.json();
        console.log(data);
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
}
