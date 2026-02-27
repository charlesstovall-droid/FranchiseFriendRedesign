// Force HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https' &&
    req.path !== '/' &&
    req.path !== '/health' &&
    req.path !== '/_health'
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});