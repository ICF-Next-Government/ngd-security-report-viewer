# Security Features Documentation

## Overview

The NGD Security Report Viewer implements comprehensive security measures to protect against vulnerabilities and ensure safe handling of security reports. This document outlines the security features, automated checks, and best practices implemented in the project.

## Automated Security Scanning

### GitHub Actions Security Workflow

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/security-scan.yml`) that runs multiple security checks:

#### 1. **Secret Detection**
- **TruffleHog**: Scans for verified secrets in the codebase
- **Gitleaks**: Detects hardcoded secrets and credentials
- Configuration: `.gitleaks.toml` customizes detection rules

#### 2. **Dependency Vulnerability Scanning**
- **Trivy**: Scans for vulnerabilities in dependencies and containers
- **npm audit**: Checks for known vulnerabilities in npm packages
- **Dependabot**: Automated dependency updates configured in `.github/dependabot.yml`

#### 3. **Static Application Security Testing (SAST)**
- **CodeQL**: GitHub's semantic code analysis for security vulnerabilities
- **Semgrep**: Custom security rules defined in `.semgrep.yml`
- Covers JavaScript and TypeScript code

#### 4. **Container Security** (when applicable)
- Scans Docker images for vulnerabilities
- Checks for insecure configurations

#### 5. **License Compliance**
- Verifies all dependencies use approved licenses
- Flags non-standard or problematic licenses

### Scan Schedule
- **On Push**: To main and develop branches
- **On Pull Request**: Before merging
- **Weekly**: Every Monday at 9 AM UTC
- **Manual**: Via workflow dispatch

## Security Configurations

### 1. **Gitleaks Configuration** (`.gitleaks.toml`)

Detects various types of secrets:
- AWS credentials
- GitHub tokens
- API keys
- Private keys
- Database passwords
- JWT tokens
- Base64 encoded secrets

Excludes false positives from:
- Test files
- Documentation
- Example/template files
- Lock files

### 2. **Semgrep Rules** (`.semgrep.yml`)

Custom security rules for:
- SQL injection detection
- XSS vulnerabilities
- Command injection
- Path traversal
- Weak cryptography
- Hardcoded secrets
- CSRF vulnerabilities
- Open redirects
- Unsafe deserialization

### 3. **Pre-commit Hooks** (`.pre-commit-config.yaml`)

Local security checks before commits:
- Secret detection
- Private key detection
- Large file prevention
- Vulnerability scanning
- Code quality checks

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
   # Install pre-commit hooks
   pre-commit install
   ```

2. **Keep dependencies updated**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Update dependencies
   npm update
   ```

3. **Run security scans locally**
   ```bash
   # Run Gitleaks
   gitleaks detect --source .
   
   # Run Semgrep
   semgrep --config=.semgrep.yml
   ```

### For Deployment

1. **Configure Security Headers**
   ```nginx
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;";
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

## Security Scan Results

### Viewing Results

1. **GitHub Security Tab**
   - Code scanning alerts
   - Dependabot alerts
   - Secret scanning alerts

2. **Pull Request Comments**
   - Automated security scan summaries
   - Links to detailed results

3. **Workflow Summaries**
   - Detailed scan outputs
   - License check results

### Understanding Alerts

- **Critical**: Immediate action required
- **High**: Address as soon as possible
- **Medium**: Plan to fix in next release
- **Low**: Consider fixing
- **Info**: Best practice recommendations

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

### Automated Monitoring
- Dependabot security updates
- Weekly vulnerability scans
- Real-time secret detection

### Manual Reviews
- Quarterly security audits
- Dependency reviews
- Security configuration updates

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

### Security Tools Used
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- [Gitleaks](https://github.com/zricethezav/gitleaks)
- [Trivy](https://github.com/aquasecurity/trivy)
- [CodeQL](https://codeql.github.com/)
- [Semgrep](https://semgrep.dev/)
- [Dependabot](https://github.com/dependabot)

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