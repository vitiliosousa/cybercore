import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        // destination: "http://localhost:8080/pms/v1/:path*",      //localhost
        destination: "https://pms-alpha-0-0-1.onrender.com/pms/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
