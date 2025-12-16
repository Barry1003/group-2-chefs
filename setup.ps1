
# Validates that the necessary environment configuration is present
$EnvFile = ".env"
if (-not (Test-Path $EnvFile)) {
    Write-Host "Action Required: .env file is missing." -ForegroundColor Red
    Write-Host "Please create a .env file with your database credentials and configuration." -ForegroundColor Yellow
    exit 1
}

# 1. Install Dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "Installation failed"; exit 1 }

# 2. Generate Prisma Client
Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Error "Prisma generation failed"; exit 1 }

# 3. Run Migrations
Write-Host "Step 3: Running Database Migrations..." -ForegroundColor Cyan
npx prisma migrate dev
if ($LASTEXITCODE -ne 0) { Write-Error "Migration failed"; exit 1 }

Write-Host "Setup successfully completed! You are ready to code." -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the server." -ForegroundColor Green
