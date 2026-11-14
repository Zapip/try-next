import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="bg-surface-base font-sans text-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
