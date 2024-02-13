
export const isCluster = () => {
  const clusterEnabled = process.env.npm_lifecycle_script?.includes('cluster=enable');
  return clusterEnabled;
}
