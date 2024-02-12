
export const shouldUseCluster = () => {
  const clusterEnabled = process.env.npm_lifecycle_script?.includes('cluster=enable');
  return clusterEnabled;
}
