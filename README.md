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

## As a Local (Containerized) Service

This is useful when doing development and you need to regularly review security scans, actively, when you generate them. Specically, this is very useful for doing security remediations locally.

> Run this from the root of the repo.

```bash
make start
```

Visit [http://localhost:9867](http://localhost:9867) in the browser.

## As a CLI Tool

This is best used for programmatically and automatically integrating the generation of these scan reports.

> Run from the root of the repo.

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

## As a GHA

This is best for generating from within a GHA.

```yaml
name: ICF Sarif Report Generator
uses: ICF-Next-Government/icf-sarif-viewer@main
with:
  in: scan.sarif.json
  out: report.html
```

Under the hood this just invokes the CLI method against the varibles you feed it.
