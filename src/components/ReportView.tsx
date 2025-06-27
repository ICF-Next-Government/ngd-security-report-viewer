import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "../types/sarif";
import { ReportSummary } from "./ReportSummary";
import { FindingsList } from "./FindingsList";

interface ReportViewProps {
  results: ProcessedResult[];
  summary: ReportSummaryType;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  results,
  summary,
  onBack,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportHTML = () => {
    setIsExporting(true);
    try {
      // Export a static HTML file that closely matches the in-app report (Shadcn/Tailwind look)
      // Inline TailwindCSS via CDN and custom styles for a clean, modern, dark report
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Analysis Report</title>
  <link href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <style>
    html { background: #0f172a; }
    body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; }
    .backdrop-blur-sm { backdrop-filter: blur(6px); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(15 23 42 / 0.3), 0 4px 6px -4px rgb(15 23 42 / 0.3); }
    .rounded-lg { border-radius: 0.75rem; }
    .rounded-xl { border-radius: 1rem; }
    .border { border-width: 1px; }
    .border-slate-700 { border-color: #334155; }
    .border-red-700 { border-color: #b91c1c; }
    .border-orange-700 { border-color: #c2410c; }
    .border-amber-700 { border-color: #b45309; }
    .border-blue-700 { border-color: #1d4ed8; }
    .border-slate-600 { border-color: #475569; }
    .bg-slate-800 { background-color: #1e293b; }
    .bg-slate-800\\/50 { background-color: rgba(30,41,59,0.5); }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-red-900\\/20 { background-color: rgba(127,29,29,0.2); }
    .bg-orange-900\\/20 { background-color: rgba(124,45,18,0.2); }
    .bg-amber-900\\/20 { background-color: rgba(120,53,15,0.2); }
    .bg-blue-900\\/20 { background-color: rgba(30,58,138,0.2); }
    .bg-slate-700\\/50 { background-color: rgba(51,65,85,0.5); }
    .bg-blue-500\\/20 { background-color: rgba(59,130,246,0.2); }
    .bg-green-500\\/20 { background-color: rgba(34,197,94,0.2); }
    .bg-purple-500\\/20 { background-color: rgba(168,85,247,0.2); }
    .text-white { color: #fff; }
    .text-slate-300 { color: #cbd5e1; }
    .text-slate-400 { color: #94a3b8; }
    .text-slate-100 { color: #f1f5f9; }
    .text-blue-400 { color: #38bdf8; }
    .text-red-300 { color: #fca5a5; }
    .text-orange-300 { color: #fdba74; }
    .text-amber-300 { color: #fde68a; }
    .text-blue-300 { color: #93c5fd; }
    .text-slate-300 { color: #cbd5e1; }
    .text-slate-600 { color: #475569; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-4xl { font-size: 2.25rem; }
    .container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .mb-12 { margin-bottom: 3rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-12 { margin-top: 3rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-12 { padding: 3rem; }
    .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
    .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
    .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
    .space-x-3 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.75rem; }
    .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1 1 0%; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-2 { gap: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .border { border-width: 1px; }
    .overflow-x-auto { overflow-x: auto; }
    .min-w-0 { min-width: 0; }
    .w-full { width: 100%; }
    .w-3 { width: 0.75rem; }
    .h-3 { height: 0.75rem; }
    .h-4 { height: 1rem; }
    .w-4 { width: 1rem; }
    .h-5 { height: 1.25rem; }
    .w-5 { width: 1.25rem; }
    .h-6 { height: 1.5rem; }
    .w-6 { width: 1.5rem; }
    .h-8 { height: 2rem; }
    .w-8 { width: 2rem; }
    .max-w-7xl { max-width: 80rem; }
    .rounded-lg { border-radius: 0.75rem; }
    .rounded-xl { border-radius: 1rem; }
    .border { border-width: 1px; }
    .border-slate-700 { border-color: #334155; }
    .border-slate-600 { border-color: #475569; }
    .border-red-700 { border-color: #b91c1c; }
    .border-orange-700 { border-color: #c2410c; }
    .border-amber-700 { border-color: #b45309; }
    .border-blue-700 { border-color: #1d4ed8; }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-slate-800\\/50 { background-color: rgba(30,41,59,0.5); }
    .bg-slate-800 { background-color: #1e293b; }
    .bg-red-900\\/20 { background-color: rgba(127,29,29,0.2); }
    .bg-orange-900\\/20 { background-color: rgba(124,45,18,0.2); }
    .bg-amber-900\\/20 { background-color: rgba(120,53,15,0.2); }
    .bg-blue-900\\/20 { background-color: rgba(30,58,138,0.2); }
    .bg-slate-700\\/50 { background-color: rgba(51,65,85,0.5); }
    .transition-all { transition: all 0.2s; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgb(15 23 42 / 0.3), 0 4px 6px -4px rgb(15 23 42 / 0.3); }
    .hover\\:bg-slate-600\\/50:hover { background-color: rgba(71,85,105,0.5); }
    .hover\\:text-white:hover { color: #fff; }
    .cursor-pointer { cursor: pointer; }
    .text-center { text-align: center; }
    .leading-relaxed { line-height: 1.625; }
    .overflow-x-auto { overflow-x: auto; }
    .appearance-none { appearance: none; }
    .focus\\:ring-2:focus { box-shadow: 0 0 0 2px #38bdf8; }
    .focus\\:border-blue-500:focus { border-color: #38bdf8; }
    .focus\\:ring-blue-500:focus { box-shadow: 0 0 0 2px #38bdf8; }
    .pointer-events-none { pointer-events: none; }
    .opacity-50 { opacity: 0.5; }
    .invisible { visibility: hidden; }
    .visible { visibility: visible; }
    .z-10 { z-index: 10; }
    .z-20 { z-index: 20; }
    .sticky { position: sticky; }
    .top-0 { top: 0; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .md\\:grid-cols-3 { }
    .sm\\:grid-cols-2 { }
    .lg\\:grid-cols-5 { }
    .max-w-2xl { max-width: 42rem; }
    .max-w-4xl { max-width: 56rem; }
    .first\\:rounded-t-lg:first-child { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; }
    .last\\:rounded-b-lg:last-child { border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; }
    .border-t { border-top-width: 1px; }
    .border-b { border-bottom-width: 1px; }
    .border-l { border-left-width: 1px; }
    .border-r { border-right-width: 1px; }
    .border-slate-600 { border-color: #475569; }
    .border-slate-700 { border-color: #334155; }
    .border-red-700 { border-color: #b91c1c; }
    .border-orange-700 { border-color: #c2410c; }
    .border-amber-700 { border-color: #b45309; }
    .border-blue-700 { border-color: #1d4ed8; }
    .rounded { border-radius: 0.5rem; }
    .rounded-lg { border-radius: 0.75rem; }
    .rounded-xl { border-radius: 1rem; }
    .rounded-full { border-radius: 9999px; }
    .overflow-hidden { overflow: hidden; }
    .flex-wrap { flex-wrap: wrap; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .min-h-screen { min-height: 100vh; }
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
    .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
    .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
    .space-x-3 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.75rem; }
    .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1 1 0%; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .min-w-0 { min-width: 0; }
    .w-full { width: 100%; }
    .overflow-x-auto { overflow-x: auto; }
    .cursor-pointer { cursor: pointer; }
    .transition-transform { transition: transform 0.2s; }
    .rotate-180 { transform: rotate(180deg); }
    .text-slate-400 { color: #94a3b8; }
    .text-slate-300 { color: #cbd5e1; }
    .text-white { color: #fff; }
    .bg-slate-900\\/80 { background-color: rgba(15,23,42,0.8); }
    .border-slate-700 { border-color: #334155; }
    .rounded-lg { border-radius: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .leading-relaxed { line-height: 1.625; }
    .overflow-x-auto { overflow-x: auto; }
    .mt-4 { margin-top: 1rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .rounded { border-radius: 0.5rem; }
    .border { border-width: 1px; }
    .border-slate-600 { border-color: #475569; }
    .border-slate-700 { border-color: #334155; }
    .border-t { border-top-width: 1px; }
    .pt-6 { padding-top: 1.5rem; }
    .text-slate-100 { color: #f1f5f9; }
    .bg-slate-900\\/80 { background-color: rgba(15,23,42,0.8); }
    .rounded-lg { border-radius: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .overflow-x-auto { overflow-x: auto; }
    .border-slate-700 { border-color: #334155; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .rounded { border-radius: 0.5rem; }
    .border { border-width: 1px; }
    .border-slate-600 { border-color: #475569; }
    .border-slate-700 { border-color: #334155; }
    .border-t { border-top-width: 1px; }
    .pt-6 { padding-top: 1.5rem; }
    .text-slate-100 { color: #f1f5f9; }
    .bg-slate-900\\/80 { background-color: rgba(15,23,42,0.8); }
    .rounded-lg { border-radius: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .overflow-x-auto { overflow-x: auto; }
    .border-slate-700 { border-color: #334155; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <div class="flex items-center justify-center space-x-3 mb-6">
        <div class="p-3 bg-blue-600 rounded-xl shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h1 class="text-4xl font-bold text-white">SARIF Report Viewer</h1>
      </div>
      <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
        Upload your Semgrep SARIF files to generate comprehensive security analysis reports
        with detailed findings, severity breakdowns, and actionable insights.
      </p>
    </div>
    <div class="space-y-8">
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <div class="flex items-center space-x-3 mb-4">
          <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h2 class="text-2xl font-bold text-white">Security Analysis Report</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-slate-400">Tool:</span>
            <span class="ml-2 font-medium text-white">${summary.toolName} ${summary.toolVersion ? `v${summary.toolVersion}` : ""}</span>
          </div>
          <div>
            <span class="text-slate-400">Total Findings:</span>
            <span class="ml-2 font-medium text-white">${summary.totalFindings}</span>
          </div>
          <div>
            <span class="text-slate-400">Files Affected:</span>
            <span class="ml-2 font-medium text-white">${summary.filesAffected}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        ${(() => {
          const cards = [
            {
              label: "Critical",
              count: summary.criticalCount,
              color: "bg-red-500",
              bgColor: "bg-red-900/20",
              textColor: "text-red-300",
              borderColor: "border-red-700",
            },
            {
              label: "High",
              count: summary.highCount,
              color: "bg-orange-500",
              bgColor: "bg-orange-900/20",
              textColor: "text-orange-300",
              borderColor: "border-orange-700",
            },
            {
              label: "Medium",
              count: summary.mediumCount,
              color: "bg-amber-500",
              bgColor: "bg-amber-900/20",
              textColor: "text-amber-300",
              borderColor: "border-amber-700",
            },
            {
              label: "Low",
              count: summary.lowCount,
              color: "bg-blue-500",
              bgColor: "bg-blue-900/20",
              textColor: "text-blue-300",
              borderColor: "border-blue-700",
            },
            {
              label: "Info",
              count: summary.infoCount,
              color: "bg-slate-500",
              bgColor: "bg-slate-800/50",
              textColor: "text-slate-300",
              borderColor: "border-slate-600",
            },
          ];
          return cards
            .map(
              (card) => `
            <div class="${card.bgColor} ${card.borderColor} backdrop-blur-sm rounded-lg border p-6 transition-all hover:scale-105 hover:shadow-lg">
              <div class="flex items-center justify-between mb-3">
                <div class="h-5 w-5 ${card.textColor}"><!-- icon placeholder --></div>
                ${card.count > 0 ? `<div class="w-3 h-3 rounded-full ${card.color}"></div>` : ""}
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold text-white">${card.count}</p>
                <p class="text-sm font-medium ${card.textColor}">${card.label}</p>
              </div>
            </div>
          `,
            )
            .join("");
        })()}
      </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
        <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div class="h-full flex">
            ${(() => {
              const total = summary.totalFindings;
              const cards = [
                {
                  label: "Critical",
                  count: summary.criticalCount,
                  color: "bg-red-500",
                },
                {
                  label: "High",
                  count: summary.highCount,
                  color: "bg-orange-500",
                },
                {
                  label: "Medium",
                  count: summary.mediumCount,
                  color: "bg-amber-500",
                },
                { label: "Low", count: summary.lowCount, color: "bg-blue-500" },
                {
                  label: "Info",
                  count: summary.infoCount,
                  color: "bg-slate-500",
                },
              ];
              return cards
                .map((card) => {
                  const percentage = total > 0 ? (card.count / total) * 100 : 0;
                  return `<div class="${card.color}" style="width: ${percentage}%"></div>`;
                })
                .join("");
            })()}
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-400 mt-2">
          <span>0</span>
          <span>${summary.totalFindings} total findings</span>
        </div>
      </div>
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Security Findings</h2>
          <span class="text-slate-400">${results.length} findings</span>
        </div>
        <div class="space-y-6">
          ${
            results.length === 0
              ? `<div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-12 text-center shadow-lg">
                  <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <h3 class="text-lg font-medium text-white mb-2">No findings found</h3>
                  <p class="text-slate-400">This SARIF file contains no security findings.</p>
                </div>`
              : results
                  .map((result, idx) => {
                    const severityColors = {
                      critical: {
                        bg: "bg-red-900/20",
                        text: "text-red-300",
                        border: "border-red-700",
                        icon: "text-red-400",
                        badge: "bg-red-900/40 text-red-300 border-red-700",
                      },
                      high: {
                        bg: "bg-orange-900/20",
                        text: "text-orange-300",
                        border: "border-orange-700",
                        icon: "text-orange-400",
                        badge:
                          "bg-orange-900/40 text-orange-300 border-orange-700",
                      },
                      medium: {
                        bg: "bg-amber-900/20",
                        text: "text-amber-300",
                        border: "border-amber-700",
                        icon: "text-amber-400",
                        badge:
                          "bg-amber-900/40 text-amber-300 border-amber-700",
                      },
                      low: {
                        bg: "bg-blue-900/20",
                        text: "text-blue-300",
                        border: "border-blue-700",
                        icon: "text-blue-400",
                        badge: "bg-blue-900/40 text-blue-300 border-blue-700",
                      },
                      info: {
                        bg: "bg-slate-800/50",
                        text: "text-slate-300",
                        border: "border-slate-600",
                        icon: "text-slate-400",
                        badge:
                          "bg-slate-700/50 text-slate-300 border-slate-600",
                      },
                    };
                    const colors = severityColors[result.severity];
                    return `
                  <div class="${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 transition-all hover:shadow-lg hover:scale-[1.01]">
                    <div class="flex items-start space-x-4">
                      <div class="h-6 w-6 ${colors.icon} mt-1 flex-shrink-0"><!-- icon --></div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center space-x-3">
                            <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border">${result.severity.toUpperCase()}</span>
                            <span class="text-sm text-slate-400">${result.ruleId}</span>
                          </div>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">${result.ruleName}</h3>
                        <p class="text-slate-300 mb-4 leading-relaxed">${result.message}</p>
                        <div class="flex items-center space-x-6 text-sm text-slate-400">
                          <div class="flex items-center space-x-2">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <span>${result.file}</span>
                          </div>
                          ${result.startLine ? `<span>Line ${result.startLine}${result.endLine && result.endLine !== result.startLine ? `-${result.endLine}` : ""}</span>` : ""}
                        </div>
                        ${result.tags.length > 0 ? `<div class="flex flex-wrap gap-2 mt-4">${result.tags.map((tag) => `<span class="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600">${tag}</span>`).join("")}</div>` : ""}
                      </div>
                    </div>
                    ${
                      result.description || result.snippet
                        ? `
                      <div class="mt-6 pt-6 border-t border-slate-600">
                        ${
                          result.description
                            ? `
                          <div class="mb-6">
                            <h4 class="font-medium text-white mb-3">Description</h4>
                            <p class="text-slate-300 text-sm leading-relaxed">${result.description}</p>
                          </div>
                        `
                            : ""
                        }
                        ${
                          result.snippet
                            ? `
                          <div>
                            <h4 class="font-medium text-white mb-3">Code Snippet</h4>
                            <pre class="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700"><code>${result.snippet}</code></pre>
                          </div>
                        `
                            : ""
                        }
                      </div>
                    `
                        : ""
                    }
                  </div>
                  `;
                  })
                  .join("")
          }
        </div>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim();

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `security-report-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating HTML report:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/70 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Upload</span>
              </button>

              <div className="h-6 border-l border-slate-600"></div>

              <h1 className="text-xl font-semibold text-white">
                Security Analysis Report
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button
                  onClick={handleExportHTML}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{isExporting ? "Exporting..." : "Export as HTML"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        id="report-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        <ReportSummary summary={summary} />
        <FindingsList results={results} />
      </div>
    </div>
  );
};
