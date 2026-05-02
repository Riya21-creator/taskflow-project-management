import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    preview: {
        allowedHosts: [
            "fearless-upliftment-production-d559.up.railway.app"
        ]
    }
});