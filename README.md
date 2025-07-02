# ICF Sarif Viewer

This can be used as:

- Local UI (containerized)
- CLI Tool
- GitHub Action

This is a small application for viewing Sarif JSON files. Either as a local running server to use for local development/debugging or as a CLI and GitHub Action for integration and automation of human readable Sarif JSON reports as static HTML files (like Trivy, same idea).

![ICF Sarif Viewer](./.docs/icf-sarif-viewer-file-upload.png)

# Quick Start

Ideally, this is intended to be used based on your use cases, but should support many integration and unknown use cases.

## As a Local (Containerized) Service

This is useful when doing development and you need to regularly review security scans, actively, when you generate them. Specically, this is very useful for doing security remediations locally.

> Run this from the root of the repo.

```bash
make start
```

Visit [http://localhost:9867](http://localhost:9867) in the browser.

If you want an all-in-one command, here you go (NOTE: requires the `gh` CLI):

```bash
gh repo clone ICF-Next-Government/icf-sarif-viewer; cd icf-sarif-viewer; make start; cd ..;
```

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
