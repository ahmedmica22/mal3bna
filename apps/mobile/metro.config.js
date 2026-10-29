const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const http = require('http');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  path.resolve(workspaceRoot, 'packages'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : config.resolver.blockList
    ? [config.resolver.blockList]
    : [];

config.resolver.blockList = [
  ...existingBlockList,
  new RegExp(path.resolve(workspaceRoot, 'apps/api').replace(/\\/g, '[/\\\\]')),
  new RegExp(path.resolve(workspaceRoot, 'apps/web').replace(/\\/g, '[/\\\\]')),
  new RegExp(path.resolve(workspaceRoot, '.git').replace(/\\/g, '[/\\\\]')),
];

// Proxy /api/* requests arriving at Metro (including via Expo Tunnel) to the API backend on port 3000
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware, server) => {
    return (req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        const proxyReq = http.request(
          {
            hostname: '127.0.0.1',
            port: 3000,
            path: req.url,
            method: req.method,
            headers: {
              ...req.headers,
              host: '127.0.0.1:3000',
            },
          },
          (proxyRes) => {
            const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
            const canCompress =
              acceptsGzip &&
              req.method !== 'HEAD' &&
              proxyRes.statusCode === 200 &&
              !proxyRes.headers['content-encoding'] &&
              /application\/json/i.test(proxyRes.headers['content-type'] || '');
            const headers = { ...proxyRes.headers };
            if (canCompress) {
              delete headers['content-length'];
              headers['content-encoding'] = 'gzip';
              headers.vary = headers.vary ? `${headers.vary}, Accept-Encoding` : 'Accept-Encoding';
            }
            res.writeHead(proxyRes.statusCode || 502, headers);
            const onComplete = (error) => {
              if (error && !res.destroyed) res.destroy();
            };
            if (canCompress) pipeline(proxyRes, createGzip(), res, onComplete);
            else pipeline(proxyRes, res, onComplete);
          },
        );

        proxyReq.on('error', (err) => {
          if (res.headersSent || res.destroyed) {
            if (!res.destroyed) res.destroy();
            return;
          }
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'API Gateway Proxy Error: ' + err.message }));
        });

        res.on('close', () => {
          if (!res.writableFinished) proxyReq.destroy();
        });

        req.pipe(proxyReq, { end: true });
        return;
      }
      if (originalEnhanceMiddleware) {
        return originalEnhanceMiddleware(metroMiddleware, server)(req, res, next);
      }
      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = config;
