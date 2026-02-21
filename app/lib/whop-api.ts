"use server";

import Whop from "@whop/sdk";

export const whopApi = new Whop({
  apiKey: process.env.WHOP_API_KEY,
});