# BACKSPACE FESTIVAL - Pre-Deployment Checklist

## Security ✓
- [x] `.gitignore` configured
- [x] `.env.local` not tracked in git
- [x] Sensitive keys stored in environment variables

## Build ✓
- [x] `npm run build` completes successfully
- [x] Production server runs locally
- [x] Sequence integration configured

## Configuration Files ✓
- [x] `vercel.json` created
- [x] `package.json` scripts updated
- [x] `next.config.js` properly configured

## Environment Variables
- [ ] Copy from `.env.local`:
  ```
  NEXT_PUBLIC_SEQUENCE_PROJECT_KEY=AQAAAAAAAKNEa9go4i7crlEOx697Sph52UY
  NEXT_PUBLIC_SEQUENCE_WAAS_URL=eyJwcm9qZWN0SWQiOjQxNzk2LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=
  ```
  Add these to Vercel environment variables during deployment.

## Deployment Steps
1. Push code to GitHub
2. Create new project in Vercel
3. Add environment variables
4. Deploy
5. Verify deployment
   - Check Sequence wallet connection
   - Test token gating
   - Verify 3D environment loads
   - Check agent interactions

## Post-Deployment
- [ ] Test on mobile devices
- [ ] Verify environment variables
- [ ] Check console for errors
- [ ] Test wallet connection
- [ ] Verify loading screen
