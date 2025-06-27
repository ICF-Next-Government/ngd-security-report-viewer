# ICF Sarif Viewer

This can be used as:

- Local viewer (containerized)
- CLI Tool
- GitHub Action

This small application can accept Sarif JSON files and parse them into a human readable UI. Those UIs can be exported as static HTML files (think Trivy scan outputs, and used as attachments for GitHub Actions from things like Semgrep scans.

# Quick Start

There are 3 ways to this project;

- As a local (containerized) running service to aid development while running local security scans and viewing them.
- As a CLI tool. Where you can manually run the CLI tool yourself.
- As a GitHub Action, which just uses the application as a CLI tool, wrapped in a GHA.

## Local (Containerized)

Just pull the repo. From the root of the repo run this command:

```bash
make start
```

Visit [http://localhost:9867](http://localhost:9867) in the browser.

## CLI Tool

From the root of the repo you can run this:

```bash
bun src/cli/generate-html-report.ts --input <sarif_json_file> --output <report_html_file>
```

Here is a working example:

```bash
# If there is a "scan.sarif.json" file in the
# root of the repo, then it will generate a
# "report.html" file that contains the viewer
# results.
bun src/cli/generate-html-report.ts --input scan.sarif.json --output report.html
```

## GHA

Add this to GHA that generates a Sarif JSON file and update the input to where that Sarif JSON is in the `in` variable and the name of the output you want in the `out` variable. Then you can attach the generated static HTML file to the GHA as a security scan artifact for human reable HTML reports.

```yaml
name: ...
with:
  in: scan.sarif.json
  out: report.html
```

Under the hood this just invokes the CLI method against the varibles you feed it.
