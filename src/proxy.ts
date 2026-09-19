export { proxy } from "../proxy";

export const config = {
    matcher: [
        "/control-panel",
        "/control-panel/:path*",
        "/api/control-panel",
        "/api/control-panel/:path*",
    ],
};

