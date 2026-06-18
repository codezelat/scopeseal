import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScopeSeal by Codezela",
    short_name: "ScopeSeal",
    description:
      "Check project briefs, client messages, and proposal scopes for missing details, vague wording, and scope-creep risks.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b22",
    theme_color: "#0a0f2c",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
