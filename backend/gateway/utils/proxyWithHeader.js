import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl) => {
    const target = serviceUrl || "http://localhost:8000"
    return proxy(target, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts
        }
    })
}