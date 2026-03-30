"use client";

import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ParsedDataset = {
  headers: string[];
  rows: Array<Record<string, string>>;
  fileName: string;
};

function normalizeRow(row: Record<string, unknown>, headers: string[]) {
  return headers.reduce<Record<string, string>>((accumulator, header) => {
    const value = row[header];
    accumulator[header] = value == null ? "" : String(value);
    return accumulator;
  }, {});
}

function normalizeHeaders(headers: string[]) {
  return headers.map((header) => header.trim()).filter(Boolean);
}

async function parseCsv(file: File): Promise<ParsedDataset> {
  const text = await file.text();

  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });

  const headers = normalizeHeaders(result.meta.fields ?? []);
  const rows = result.data.map((row) => normalizeRow(row, headers));

  return {
    headers,
    rows,
    fileName: file.name
  };
}

async function parseWorkbook(file: File): Promise<ParsedDataset> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: ""
  });

  const headers = normalizeHeaders(Object.keys(rawRows[0] ?? {}));
  const rows = rawRows.map((row) => normalizeRow(row, headers));

  return {
    headers,
    rows,
    fileName: file.name
  };
}

export async function parseSpreadsheet(file: File): Promise<ParsedDataset> {
  if (file.name.toLowerCase().endsWith(".csv")) {
    return parseCsv(file);
  }

  return parseWorkbook(file);
}

export function inferRecipientColumn(headers: string[]) {
  const preferred = headers.find((header) => /^email$/i.test(header));

  if (preferred) {
    return preferred;
  }

  return headers.find((header) => /email|mail/i.test(header)) ?? headers[0] ?? "";
}
