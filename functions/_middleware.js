const CANONICAL_HOST = "openrepoguide.com";

const PRETTY_ROUTES = new Set([
  "/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/autoresearch-github-guide/",
  "/autoresearch-vs-autora/",
  "/autoresearch-tutorial/",
  "/best-gpu-cloud-for-autoresearch/",
  "/run-autoresearch-on-mac-or-small-gpus/",
]);

const STATIC_ASSETS = new Set([
  "/styles.css",
  "/favicon.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/og-cover.svg",
]);

function notFound(url) {
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Not Found | Open Repo Guide</title>
  <meta name="robots" content="noindex,follow">
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #09121b; color: #eef5fb; }
    main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    section { max-width: 560px; padding: 28px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { margin: 0 0 12px; color: #a8b7c6; line-height: 1.6; }
    a { color: #68f0ff; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>Page not found</h1>
      <p>The URL <code>${url.pathname}</code> does not exist on Open Repo Guide.</p>
      <p><a href="https://${CANONICAL_HOST}/">Return to the homepage</a></p>
    </section>
  </main>
</body>
</html>`;

  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (pathname === "/favicon.ico") {
    url.pathname = "/favicon.svg";
    return Response.redirect(url.toString(), 301);
  }

  if (pathname !== "/" && !pathname.endsWith("/")) {
    const slashVariant = `${pathname}/`;
    if (PRETTY_ROUTES.has(slashVariant)) {
      url.pathname = slashVariant;
      return Response.redirect(url.toString(), 301);
    }
  }

  if (PRETTY_ROUTES.has(pathname) || STATIC_ASSETS.has(pathname)) {
    return context.next();
  }

  return notFound(url);
}
