"use server";

import axios from "axios";

export interface AccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// TODO: This is probably deprecated, we should probably use auth0.getAccessToken()
// Create an access token for the Auth0 management API, this is used to fetch user roles
export async function createAccessToken(): Promise<AccessToken> {
  try {
    const response = await axios.post<AccessToken>(
      `${process.env.AUTH0_DOMAIN}/oauth/token`,
      JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get Auth0 management token", error);
  }
}
