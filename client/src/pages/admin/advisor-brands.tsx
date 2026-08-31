import { useEffect, useState } from "react";
import { AdvisorAdminFrame } from "./advisor-layout";
import { advisorJson } from "@/lib/advisor-api";

type Brand = {
  id: string;
  brandName: string;
  category: string | null;
  investmentRange: string | null;
  minLiquidity: string | null;
  ownerRole: string | null;
  approvedForAi: boolean;
  dateLastVerified: string | null;
  chuckNotes: string | null;
};

const empty = {
  brandName: "",
  category: "",
  investmentRange: "",
  minLiquidity: "",
  ownerRole: "",
  employeeProfile: "",
  salesModel: "",
  recurringRevenueCharacteristics: "",
  brickAndMortarRequirements: "",
  buildoutLevel: "",
  typicalDevelopmentStructure: "",
  availableTerritories: "",
  fddYear: "",
  sbaDirectoryStatus: "",
  chuckNotes: "",
  approvedForAi: false,
};

export default function AdvisorAdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(empty);
  const [csv, setCsv] = useState("");

  const load = () => advisorJson<{ brands: Brand[] }>("/api/advisor/admin/brands").then((d) => setBrands(d.brands));
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  return (
    <AdvisorAdminFrame>
      <h1 className="advisor-display text-4xl mb-2">Approved brands</h1>
      <p className="text-sm text-[#12304C]/65 mb-8 max-w-2xl">
        Empty by design. The advisor may describe business-model characteristics without approval. It may name a franchise only when the brand is here, approved for AI consideration, and current.
      </p>
      <form
        className="grid md:grid-cols-2 gap-4 mb-10"
        onSubmit={async (e) => {
          e.preventDefault();
          await advisorJson("/api/advisor/admin/brands", { method: "POST", body: JSON.stringify(form) });
          setForm(empty);
          load();
        }}
      >
        {Object.entries(form).map(([key, value]) =>
          key === "approvedForAi" ? (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(value)} onChange={(e) => setForm({ ...form, approvedForAi: e.target.checked })} />
              Approved for AI consideration
            </label>
          ) : (
            <input
              key={key}
              className="bg-transparent border-b border-[#12304C]/25 py-2"
              placeholder={key}
              value={String(value)}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ),
        )}
        <button type="submit" className="bg-[#12304C] text-[#F4ECE1] text-sm py-2">Add brand</button>
      </form>

      <div className="flex gap-3 mb-8">
        <a href="/api/advisor/admin/brands/export.csv" className="text-sm border border-[#12304C]/30 px-3 py-2">Export CSV</a>
      </div>
      <textarea className="w-full min-h-28 bg-transparent border border-[var(--advisor-line)] p-3 mb-3" placeholder="Paste CSV to import" value={csv} onChange={(e) => setCsv(e.target.value)} />
      <button
        type="button"
        className="text-sm border border-[#12304C] px-3 py-2 mb-10"
        onClick={async () => {
          await advisorJson("/api/advisor/admin/brands/import", { method: "POST", body: JSON.stringify({ csv }) });
          setCsv("");
          load();
        }}
      >
        Import CSV
      </button>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.14em] border-b border-[var(--advisor-line)]">
            <th className="py-3">Brand</th>
            <th>Category</th>
            <th>Investment</th>
            <th>AI</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-b border-[var(--advisor-line)]">
              <td className="py-3">{brand.brandName}</td>
              <td>{brand.category}</td>
              <td>{brand.investmentRange}</td>
              <td>{brand.approvedForAi ? "Yes" : "No"}</td>
              <td>
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={async () => {
                    await advisorJson(`/api/advisor/admin/brands/${brand.id}`, { method: "DELETE" });
                    load();
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {!brands.length ? (
            <tr>
              <td className="py-8 text-[#12304C]/55" colSpan={5}>No brands seeded. That is intentional.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </AdvisorAdminFrame>
  );
}
