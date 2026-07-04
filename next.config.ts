import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;



// To watch your API calls & cache hits → the terminal (your npm run dev window), via this config:

// // next.config.ts
// logging: { fetches: { fullUrl: true } }

// This prints every fetch with its cache status (HIT / MISS / SKIP) — that's your "is it cached / did it invalidate?" view. It's the closest thing to the RTK Query cache inspector.
// Server Actions are logged automatically in dev: POST / └─ ƒ likePost(arg) in 5ms app/actions/posts.ts. And they do show in the Network tab (as a POST to the current URL — that's the RPC).
// To see a value → console.log inside a query or action prints to the terminal, not the browser console. (You can even forward browser logs to the terminal with 


// logging: { browserToTerminal: true }
