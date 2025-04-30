import { useEffect, useState } from "react";
import type { Config } from "../types";

export const useConfig = () => {
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/strapi-cloudinary-media-library/config');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch plugin config:', err);
      }
    };

    fetchConfig();
  }, []);

  return config;
}