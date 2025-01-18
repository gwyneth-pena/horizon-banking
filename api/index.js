async function loadServer() {
  const serverModule = await import(
    "../dist/apps/banking/server/server.mjs"
  );
  return serverModule.app;
}

export default loadServer().then((app) => app());
