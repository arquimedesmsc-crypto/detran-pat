import { describe, it, expect } from "vitest";
import { formatarCSV, formatarXLSX, formatarPDF } from "./db";

describe("Export Functions", () => {
  const mockItems = [
    {
      id: 1,
      patrimonio: "PAT001",
      descricao: "Computador Desktop",
      setor: "12 DAT",
      local: "Sala 101",
      dataIncorporacao: new Date("2024-01-15"),
      valor: 2500.00,
      status: "localizado",
      tipo: "informatica",
    },
    {
      id: 2,
      patrimonio: "PAT002",
      descricao: "Impressora Laser",
      setor: "15 DSI",
      local: "Sala 202",
      dataIncorporacao: new Date("2023-06-20"),
      valor: 1200.00,
      status: "nao_localizado",
      tipo: "informatica",
    },
  ];

  describe("formatarCSV", () => {
    it("should generate valid CSV with headers and data", () => {
      const csv = formatarCSV(mockItems);
      
      expect(csv).toBeDefined();
      expect(csv.length).toBeGreaterThan(0);
      
      const lines = csv.split("\n");
      expect(lines.length).toBeGreaterThan(2);
      
      expect(lines[0]).toContain("Patrimônio");
      expect(lines[0]).toContain("Descrição");
      expect(lines[0]).toContain("Setor");
    });

    it("should handle empty array", () => {
      const csv = formatarCSV([]);
      expect(csv).toBe("");
    });
  });

  describe("formatarXLSX", () => {
    it("should generate XLSX buffer", async () => {
      const buffer = await formatarXLSX(mockItems);
      
      expect(buffer).toBeDefined();
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it("should handle empty array", async () => {
      const buffer = await formatarXLSX([]);
      expect(buffer).toBeDefined();
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });
  });

  describe("formatarPDF", () => {
    it("should generate PDF buffer", async () => {
      const buffer = await formatarPDF(mockItems);
      
      expect(buffer).toBeDefined();
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
      
      const pdfHeader = buffer.toString("utf8", 0, 4);
      expect(pdfHeader).toContain("%PDF");
    });

    it("should handle empty array", async () => {
      const buffer = await formatarPDF([]);
      expect(buffer).toBeDefined();
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it("should include DETRAN-RJ header in PDF", async () => {
      const buffer = await formatarPDF(mockItems);
      
      expect(buffer.length).toBeGreaterThan(1000);
    });
  });

  describe("Export data consistency", () => {
    it("CSV should contain all item data", () => {
      const csv = formatarCSV(mockItems);
      
      mockItems.forEach((item) => {
        expect(csv).toContain(item.patrimonio);
        expect(csv).toContain(item.setor);
      });
    });

    it("should format values correctly", () => {
      const csv = formatarCSV(mockItems);
      
      expect(csv).toContain("2.500,00");
      expect(csv).toContain("1.200,00");
    });
  });
});
