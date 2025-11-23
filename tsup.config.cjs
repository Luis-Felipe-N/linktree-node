const { defineConfig } = require('tsup')

module.exports = defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.e2e-spec.ts'],
  external: ['mock-aws-s3', 'aws-sdk', 'nock']
})
