import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { AccessToken, createAccessToken } from "actions/createAccessToken";

import axios from "axios";

export const auth0 = new Auth0Client();

let accessToken: AccessToken = null;
let accessTokenExpiryDate: Date = null;

const getAccessToken = async () => {
  // Check if we need a new token.
  if (new Date() > accessTokenExpiryDate) {
    accessToken = await createAccessToken();

    accessTokenExpiryDate = new Date();
    accessTokenExpiryDate.setSeconds(
      accessTokenExpiryDate.getSeconds() + accessToken.expires_in,
    );
  }

  return accessToken.access_token;
};

export const getUsers = async () => {
  const token = await getAccessToken();

  const response = await fetch(`${process.env.AUTH0_DOMAIN}/api/v2/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch users");
  return await response.json();
};

export const getUserById = async (userId: string) => {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch user");
  return await response.json();
};

export const getUserRoles = async (userId: string) => {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch roles");
  return await response.json();
};

export const assignAdminRole = async (userId: string) => {
  const token = await getAccessToken();

  // FIXME: move to env variable, this matches auth0 dashboard
  const ADMIN_ROLE_ID = "rol_TWxkYhwEPNflB5Hf";

  try {
    await axios.post(
      `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
      JSON.stringify({
        roles: [ADMIN_ROLE_ID],
      }),
      {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
          "cache-control": "no-cache",
        },
      },
    );
  } catch (error) {
    throw new Error("Failed to assign admin role: ", error);
  }
};

export const removeAdminRole = async (userId: string) => {
  const token = await getAccessToken();

  const ADMIN_ROLE_ID = "rol_TWxkYhwEPNflB5Hf";

  const response = await fetch(
    `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roles: [ADMIN_ROLE_ID],
      }),
    },
  );

  if (!response.ok) throw new Error("Failed to take admin role");
};

export const deleteUser = async (userId: string) => {
  const token = await getAccessToken();

  const DELETED_ROLE_ID = "rol_I3LgSeihyKIw1iAf";

  const response = await fetch(
    `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roles: [DELETED_ROLE_ID],
      }),
    },
  );

  if (!response.ok) throw new Error("u did not delete this user :(");
};
