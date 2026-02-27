const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const distDir = path.join(__dirname, 'dist');

// Clean and create dist
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// Copy each frontend's build output into a sub-folder
console.log('Merging frontend builds...');

copyDir(path.join(__dirname, 'Frontend-Patient', 'dist'), path.join(distDir, 'patient'));
console.log('  ✅ Patient → dist/patient/');

copyDir(path.join(__dirname, 'Frontend-Admin', 'dist'), path.join(distDir, 'admin'));
console.log('  ✅ Admin   → dist/admin/');

copyDir(path.join(__dirname, 'Frontend-Doctor', 'dist'), path.join(distDir, 'doctors'));
console.log('  ✅ Doctor  → dist/doctors/');

// Write _redirects for Netlify SPA routing
const redirects = `# Redirect root to patient portal
/   /patient/   302

# SPA routing for each sub-app
/patient/*   /patient/index.html   200
/admin/*     /admin/index.html     200
/doctors/*   /doctors/index.html   200
`;

fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
console.log('  ✅ _redirects written');
console.log('\\nBuild complete! Deploy the dist/ folder to Netlify.');
