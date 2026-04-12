import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		serverActions: {
			bodySizeLimit: "3mb",
		},
	},
	allowedDevOrigins: ["localhost", "127.0.0.1"],
	images: {
		remotePatterns: [
			// Image domains will be added later
		],
	},
};

export default nextConfig;
