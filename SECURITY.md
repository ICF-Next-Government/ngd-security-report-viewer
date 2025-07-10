# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of NGD Security Report Viewer seriously. If you have discovered a security vulnerability in this project, please report it to us as described below.

### Reporting Process

1. **DO NOT** report security vulnerabilities through public GitHub issues.

2. Instead, please report them via one of the following methods:
   - Email: security@example.com (replace with actual security email)
   - GitHub Security Advisories: [Report a vulnerability](https://github.com/ICF-Next-Government/ngd-security-report-viewer/security/advisories/new)

3. Include the following information in your report:
   - Type of issue (e.g., XSS, SQL injection, authentication bypass, etc.)
   - Full paths of source file(s) related to the manifestation of the issue
   - The location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a more detailed response within 7 days
- We will work on fixes and coordinate release timing with you

## Security Measures

This project implements several security measures:

### 1. **Automated Security Scanning**
- **Secret Detection**: TruffleHog and Gitleaks scan for exposed secrets
- **Dependency Scanning**: Trivy and npm audit check for vulnerable dependencies
- **SAST**: CodeQL and Semgrep analyze code for security vulnerabilities
- **Container Scanning**: Trivy scans Docker images (when applicable)

### 2. **Secure Development Practices**
- All commits are signed
- Dependencies are regularly updated
- Security headers are implemented
- Input validation and sanitization
- Output encoding to prevent XSS

### 3. **Third-Party Security**
- Regular dependency updates
- License compliance checks
- Vulnerability monitoring via Dependabot

## Security Best Practices for Users

When using NGD Security Report Viewer:

### 1. **File Upload Security**
- Only upload security reports from trusted sources
- Verify file integrity before uploading
- Be cautious with reports containing sensitive data

### 2. **Deployment Security**
- Use HTTPS in production environments
- Implement proper authentication if exposing to the internet
- Keep the application and its dependencies updated
- Follow the principle of least privilege

### 3. **Data Handling**
- Reports may contain sensitive security information
- Ensure proper access controls are in place
- Consider data retention policies
- Sanitize reports before sharing

## Security Features

The application includes several security-focused features:

1. **Client-Side Processing**: Reports are processed in the browser, reducing server-side attack surface
2. **Input Validation**: File type and size validation
3. **Content Security Policy**: Restricts resource loading
4. **No External Dependencies**: Minimal third-party runtime dependencies
5. **Secure Defaults**: Security-first configuration

## Known Security Considerations

1. **Large File Processing**: Very large report files may cause browser performance issues
2. **Browser Storage**: Reports may be temporarily stored in browser memory
3. **Export Features**: Exported HTML reports contain the full security data

## Security Headers

When deploying, ensure these security headers are configured:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

## Contact

For any security concerns or questions about this policy, please contact:
- Security Team: security@example.com (replace with actual email)
- Project Maintainers: Via GitHub

## Acknowledgments

We appreciate the security research community and will acknowledge reporters who help us maintain the security of this project (with their permission).