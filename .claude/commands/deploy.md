Deploy the site:
1. Run the /build checks first
2. If build succeeds, ask: "Deploy to Vercel or Netlify?"
3. Vercel: npx vercel --prod
4. Netlify: npx netlify deploy --prod --dir=dist
5. Report the live URL
