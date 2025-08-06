function createProxyReqOptDecorator() {
  return (proxyReqOpts, srcReq) => {
    if (srcReq.user) {
      proxyReqOpts.headers["x-user-id"] = srcReq.user.id;
      proxyReqOpts.headers["x-user-role"] = srcReq.user.role;
    }
    return proxyReqOpts;
  };
}

module.exports = createProxyReqOptDecorator;