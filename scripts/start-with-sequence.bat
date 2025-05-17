@echo off
echo Retroverse Festival with Sequence Integration

REM Check if Sequence dependencies are installed
call npm list @0xsequence/kit >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Sequence dependencies not found. Installing...
  call npm run install:sequence
)

REM Set environment variables for Sequence
if not exist .env.local (
  echo Creating .env.local file...
  copy .env.local.example .env.local
  echo Please update the NEXT_PUBLIC_SEQUENCE_PROJECT_KEY in .env.local
)

REM Start the development server
echo Starting development server with Sequence integration...
call npm run dev
