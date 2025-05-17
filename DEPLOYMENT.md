# BACKSPACE FESTIVAL - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Sequence Project Key and WaaS URL configured in `.env.local`
- Vercel CLI (optional, for Vercel deployment)

## Environment Variables
Ensure your `.env.local` file contains:
```
NEXT_PUBLIC_SEQUENCE_PROJECT_KEY=your_sequence_project_key
NEXT_PUBLIC_SEQUENCE_WAAS_URL=your_sequence_waas_url
```

## Local Build
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start production server
npm start
```

## Deployment Options

### 1. Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 2. Manual Deployment
1. Build the project: `npm run build`
2. Copy the following to your server:
   - `.next/` directory
   - `public/` directory
   - `package.json`
   - `.env.local` (configure with production values)
3. Run `npm install --production`
4. Start the server: `npm start`

## Post-Deployment Checklist
1. Verify Sequence wallet connection
2. Test token gating
3. Check 3D environment loading
4. Verify agent interactions

## Security Notes
- Ensure `.env.local` is not committed to Git
- Use environment variables for all sensitive data
- Keep your Sequence Project Key secure

## Troubleshooting
If you encounter issues:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity for Sequence services
