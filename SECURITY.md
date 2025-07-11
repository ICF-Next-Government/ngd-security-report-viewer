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

2. Instead, please report them by creating a private security advisory in the GitHub repository.

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

### 1. **Client-Side Architecture**
- All report processing happens in the browser
- No server-side code execution
- No data transmission to external servers
- Reports remain local to the user's machine

### 2. **Secure Development Practices**
- Input validation for uploaded files
- Output encoding to prevent XSS attacks
- Proper error handling without exposing sensitive information
- Regular dependency updates
- TypeScript for type safety

### 3. **Dependency Management**
- Minimal runtime dependencies
- Regular security updates
- Build-time dependency isolation

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

1. **Client-Side Processing**: All report processing happens in the browser
2. **Input Validation**: File type and format validation
3. **No External Resources**: Self-contained HTML exports with embedded fonts and styles
4. **Data Isolation**: Reports are not stored or transmitted
5. **Safe Rendering**: Proper escaping of all user-provided content

## Known Security Considerations

1. **Large File Processing**: Very large report files may cause browser performance issues
2. **Browser Storage**: Reports are processed in browser memory only
3. **Export Features**: Exported HTML reports contain embedded security data
4. **Sensitive Data**: Users should be aware that reports may contain sensitive security information

## Security Headers (Production Deployment)

When deploying the built application, configure these security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

## Data Privacy

NGD Security Report Viewer respects user privacy:
- No telemetry or analytics
- No external API calls
- No data collection
- All processing is local

## Contact

For security concerns, please use GitHub's private security advisory feature to report vulnerabilities.

## Acknowledgments

We appreciate the security research community and will acknowledge reporters who help us maintain the security of this project (with their permission).