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
			{
				protocol: "https",
				hostname: "cdn.eucalytics.uk",
				port: "",
				pathname: "/images/**",
				search: "",
			},
		],
	},
};

export default nextConfig;
