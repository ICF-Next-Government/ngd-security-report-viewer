#!/usr/bin/env bash

# Extract Report Summary from HTML
# This script extracts the base64-encoded report summary from a statically exported HTML file
# and pretty prints it to stdout.
#
# Usage:
#   ./extract-report-summary.sh <path-to-html-file>
#   ./extract-report-summary.sh <path-to-html-file> --json
#   ./extract-report-summary.sh <path-to-html-file> --raw
#
# Options:
#   --json    Output raw JSON (pretty printed)
#   --raw     Output raw JSON (compact)
#   --help    Show this help message

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Function to show usage
show_usage() {
    echo "Extract Report Summary from HTML"
    echo ""
    echo "Usage:"
    echo "  $0 <path-to-html-file> [options]"
    echo ""
    echo "Options:"
    echo "  --json    Output raw JSON (pretty printed)"
    echo "  --raw     Output raw JSON (compact)"
    echo "  --help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 report.html"
    echo "  $0 report.html --json"
    echo "  $0 report.html --raw"
    exit 0
}

# Function to print error and exit
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for help flag
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    show_usage
fi

# Check arguments
if [[ $# -lt 1 ]]; then
    error_exit "Missing HTML file path. Use --help for usage information."
fi

HTML_FILE="$1"
OUTPUT_MODE="${2:-formatted}"

# Check if file exists
if [[ ! -f "$HTML_FILE" ]]; then
    error_exit "File not found: $HTML_FILE"
fi

# Check for required commands
if ! command_exists grep; then
    error_exit "grep command not found"
fi

if ! command_exists base64; then
    error_exit "base64 command not found"
fi

if ! command_exists jq; then
    echo -e "${YELLOW}⚠️  Warning: jq is not installed. JSON output will not be pretty-printed.${NC}" >&2
    echo -e "${YELLOW}   Install jq for better JSON formatting: https://stedolan.github.io/jq/download/${NC}" >&2
    echo "" >&2
fi

# Extract the data-report-summary attribute
echo -e "${CYAN}🔍 Extracting data from: $HTML_FILE${NC}" >&2

# Use grep to find the attribute and extract the base64 data
# Using sed for portability (grep -P is not available on macOS)
BASE64_DATA=$(grep -o 'data-report-summary="[^"]*"' "$HTML_FILE" 2>/dev/null | sed 's/data-report-summary="//; s/"$//' || true)

if [[ -z "$BASE64_DATA" ]]; then
    error_exit "Could not find data-report-summary attribute in the HTML file"
fi

echo -e "${GREEN}✅ Found base64-encoded data${NC}" >&2

# Decode base64 to get JSON
JSON_DATA=$(echo "$BASE64_DATA" | base64 -d 2>/dev/null || true)

if [[ -z "$JSON_DATA" ]]; then
    error_exit "Failed to decode base64 data"
fi

echo -e "${GREEN}✅ Successfully decoded JSON data${NC}" >&2
echo "" >&2

# Handle different output modes
case "$OUTPUT_MODE" in
    "--json")
        # Output pretty-printed JSON
        if command_exists jq; then
            echo "$JSON_DATA" | jq .
        else
            echo "$JSON_DATA"
        fi
        ;;
    "--raw")
        # Output raw JSON (compact)
        echo "$JSON_DATA"
        ;;
    *)
        # Default: formatted output
        if command_exists jq; then
            # Parse JSON and format output
            echo -e "${BOLD}Report Summary${NC}"
            echo -e "${BOLD}==============${NC}"

            # Extract values using jq
            TIMESTAMP=$(echo "$JSON_DATA" | jq -r '.timestamp')
            TOOL=$(echo "$JSON_DATA" | jq -r '.tool')
            TOTAL_FINDINGS=$(echo "$JSON_DATA" | jq -r '.total_findings')
            FILES_AFFECTED=$(echo "$JSON_DATA" | jq -r '.files_affected')

            # Convert timestamp to human-readable format
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                FORMATTED_DATE=$(date -r "$TIMESTAMP" "+%Y-%m-%d %H:%M:%S UTC" 2>/dev/null || echo "Invalid timestamp")
            else
                # Linux
                FORMATTED_DATE=$(date -d "@$TIMESTAMP" "+%Y-%m-%d %H:%M:%S UTC" 2>/dev/null || echo "Invalid timestamp")
            fi

            echo -e "${BLUE}Timestamp:${NC} $FORMATTED_DATE (Unix: $TIMESTAMP)"
            echo -e "${BLUE}Tool:${NC} $TOOL"
            echo -e "${BLUE}Total Findings:${NC} $TOTAL_FINDINGS"
            echo -e "${BLUE}Files Affected:${NC} $FILES_AFFECTED"
            echo ""
            echo -e "${BOLD}Severity Breakdown:${NC}"

            # Extract severity counts
            CRITICAL=$(echo "$JSON_DATA" | jq -r '.severity.critical')
            HIGH=$(echo "$JSON_DATA" | jq -r '.severity.high')
            MEDIUM=$(echo "$JSON_DATA" | jq -r '.severity.medium')
            LOW=$(echo "$JSON_DATA" | jq -r '.severity.low')
            INFO=$(echo "$JSON_DATA" | jq -r '.severity.info')

            # Color code severity levels
            echo -e "  ${RED}Critical:${NC} $CRITICAL"
            echo -e "  ${RED}High:${NC} $HIGH"
            echo -e "  ${YELLOW}Medium:${NC} $MEDIUM"
            echo -e "  ${BLUE}Low:${NC} $LOW"
            echo -e "  ${CYAN}Info:${NC} $INFO"

            # Check for deduplication stats
            HAS_DEDUP=$(echo "$JSON_DATA" | jq -r 'has("deduplication")')
            if [[ "$HAS_DEDUP" == "true" ]]; then
                echo ""
                echo -e "${BOLD}Deduplication Stats:${NC}"

                UNIQUE_GROUPS=$(echo "$JSON_DATA" | jq -r '.deduplication.unique_groups')
                DUPLICATE_FINDINGS=$(echo "$JSON_DATA" | jq -r '.deduplication.duplicate_findings')
                DUPLICATION_RATE=$(echo "$JSON_DATA" | jq -r '.deduplication.duplication_rate')

                echo -e "  ${BLUE}Unique Groups:${NC} $UNIQUE_GROUPS"
                echo -e "  ${BLUE}Duplicate Findings:${NC} $DUPLICATE_FINDINGS"
                echo -e "  ${BLUE}Duplication Rate:${NC} $DUPLICATION_RATE"
            fi
        else
            # Fallback without jq - just show the raw JSON
            echo -e "${YELLOW}⚠️  Install jq for formatted output${NC}" >&2
            echo ""
            echo "$JSON_DATA"
        fi
        ;;
esac
