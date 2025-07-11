# Security Features Documentation

## Overview

The NGD Security Report Viewer implements comprehensive security measures to protect against vulnerabilities and ensure safe handling of security reports. This document outlines the security features, automated checks, and best practices implemented in the project.

## Security Best Practices

The project is designed with security in mind and supports integration with various security scanning tools. While no automated CI/CD is included in the repository, the following security practices are recommended:

### 1. **Secret Detection**
The project includes a `.gitleaks.toml` configuration file for use with Gitleaks to detect hardcoded secrets and credentials.

### 2. **Dependency Management**
- Regular dependency updates using Bun or npm
- Vulnerability scanning with `npm audit` or similar tools
- TypeScript for type safety and reduced runtime errors

### 3. **Code Quality**
- ESLint/Biome for code quality and security linting
- TypeScript strict mode enabled
- Proper error handling throughout

### 4. **Security by Design**
- Client-side only processing (no server-side attack surface)
- Input validation for all file uploads
- Proper output encoding to prevent XSS

## Security Configurations

### 1. **Gitleaks Configuration** (`.gitleaks.toml`)

The project includes a Gitleaks configuration that can detect various types of secrets:
- AWS credentials
- GitHub tokens
- API keys
- Private keys
- Database passwords
- JWT tokens
- Base64 encoded secrets

The configuration excludes false positives from:
- Test files
- Documentation
- Example/template files
- Lock files

### 2. **Development Security**

For local development, consider using:
- Pre-commit hooks for secret detection
- Regular dependency audits
- Code quality checks with Biome
- TypeScript strict mode

## Application Security Features

### 1. **Input Validation**
- File type validation (JSON/SARIF only)
- File size limits (50MB max)
- Schema validation for security reports

### 2. **Client-Side Processing**
- Reports processed in browser
- No server-side code execution
- Reduced attack surface

### 3. **Content Security**
- No external API calls
- No dynamic code execution
- Sanitized HTML output

### 4. **Secure Defaults**
- HTTPS recommended for deployment
- Security headers configuration provided
- Minimal permissions required

## Security Best Practices

### For Developers

1. **Never commit secrets**
   ```bash
   # Run Gitleaks manually
   gitleaks detect --source . --config .gitleaks.toml
   ```

2. **Keep dependencies updated**
   ```bash
   # Check for vulnerabilities
   bun audit
   # or
   npm audit
   
   # Update dependencies
   bun update
   ```

3. **Code quality checks**
   ```bash
   # Run linter
   bun run lint
   
   # Type checking
   bun run type-check
   ```

### For Deployment

1. **Configure Security Headers**
   ```nginx
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:;";
   add_header X-Content-Type-Options "nosniff";
   add_header X-Frame-Options "DENY";
   add_header X-XSS-Protection "1; mode=block";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
   ```

2. **Use HTTPS**
   - Always deploy with TLS/SSL
   - Use strong cipher suites
   - Enable HSTS

3. **Access Control**
   - Implement authentication if public-facing
   - Use principle of least privilege
   - Log access attempts

## Vulnerability Reporting

Found a security issue? Please report it responsibly:

1. **DO NOT** create public GitHub issues
2. Use GitHub Security Advisories or email security contact
3. Include:
   - Vulnerability type
   - Steps to reproduce
   - Impact assessment
   - Suggested fix (if any)

See [SECURITY.md](../SECURITY.md) for full details.

## Manual Security Testing

### Running Security Scans

1. **Secret Detection**
   ```bash
   # Using Gitleaks
   gitleaks detect --source . --config .gitleaks.toml
   ```

2. **Dependency Scanning**
   ```bash
   # Using npm/bun
   bun audit
   npm audit
   ```

3. **Code Quality**
   ```bash
   # Linting and type checking
   bun run lint
   bun run type-check
   ```

### Understanding Security Issues

- **Critical**: Immediate action required (e.g., exposed secrets, RCE vulnerabilities)
- **High**: Address as soon as possible (e.g., XSS, SQL injection risks)
- **Medium**: Plan to fix in next release (e.g., outdated dependencies)
- **Low**: Consider fixing (e.g., best practice violations)
- **Info**: Recommendations for improvement

## Compliance

### License Compliance
- Only approved licenses in dependencies
- Regular license audits
- Clear documentation of licenses used

### Security Standards
- OWASP Top 10 coverage
- CWE/SANS Top 25 addressed
- Regular security updates

## Monitoring and Maintenance

### Recommended Practices
- Regular dependency updates
- Periodic security audits
- Manual secret scanning before releases
- Security configuration reviews

### Maintenance Schedule
- Weekly: Check for dependency updates
- Monthly: Run full security audit
- Quarterly: Review security configurations
- Before releases: Complete security checklist

## Emergency Response

If a security incident occurs:

1. **Immediate Actions**
   - Revoke compromised credentials
   - Patch vulnerabilities
   - Notify affected users

2. **Investigation**
   - Review logs
   - Identify root cause
   - Document timeline

3. **Remediation**
   - Fix vulnerabilities
   - Update security measures
   - Publish security advisory

## Tools and Resources

### Recommended Security Tools
- [Gitleaks](https://github.com/zricethezav/gitleaks) - Secret detection (config included)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency scanning
- [Biome](https://biomejs.dev/) - Code quality and linting (configured)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) - Additional secret detection
- [Trivy](https://github.com/aquasecurity/trivy) - Comprehensive vulnerability scanning

### Additional Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## Continuous Improvement

Security is an ongoing process. We:
- Regularly update security configurations
- Monitor for new vulnerability types
- Incorporate security best practices
- Learn from security incidents

For questions or suggestions about security features, please contact the maintainers or open a discussion (not an issue) on GitHub.