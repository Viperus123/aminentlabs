-- ============================================================
-- Products table for AMINENT LABS
-- Run in Supabase SQL Editor
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_name text NOT NULL,
  description text NOT NULL,
  summary text NOT NULL,
  price numeric(10,2) NOT NULL,
  dosage text NOT NULL,
  purity text DEFAULT '≥99%',
  form text DEFAULT 'Lyophilized powder',
  storage text DEFAULT 'Refrigerate (36–46°F). Protect from light.',
  reconstitution text DEFAULT 'Bacteriostatic water',
  category text NOT NULL,
  image_filename text NOT NULL,
  badge text,
  specs jsonb DEFAULT '[]',
  meta_title text,
  meta_description text,
  schema_description text,
  is_featured boolean DEFAULT true,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active products" ON products;
CREATE POLICY "Anyone can read active products" ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to products" ON products;
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO products (
  slug, name, short_name, description, summary, price, dosage,
  purity, form, storage, reconstitution,
  category, image_filename, badge, specs,
  meta_title, meta_description, schema_description,
  is_featured, is_active, sort_order
) VALUES

-- 1. GLP-3 RT (Retatrutide)
(
  'glp3rt',
  'GLP-3 RT (Retatrutide)',
  'GLP-3 RT',
  '<p>Retatrutide (LY-3437943) is a novel triple agonist peptide targeting GLP-1, GIP, and glucagon receptors simultaneously. It is a 39-amino acid synthetic peptide that has been studied in research settings for its activity at multiple incretin and glucagon receptor pathways.</p><p>This peptide is supplied as a lyophilized powder for reconstitution in research settings. A full certificate of analysis is available on our site.</p>',
  '10 mg | Lyophilized Powder | RUO Peptide',
  68.00,
  '10 mg',
  '≥99%',
  'Lyophilized powder',
  'Refrigerate (36–46°F). Protect from light.',
  'Bacteriostatic water',
  'metabolic',
  'transGLP3RT.png',
  'Popular',
  '[
    {"label": "Synonyms", "value": "Retatrutide, LY-3437943"},
    {"label": "Targets", "value": "GLP-1R / GIPR / GCGR (Triple Agonist)"},
    {"label": "Molecular Weight", "value": "~4113.58 g/mol"},
    {"label": "Purity", "value": "≥99% (HPLC)"},
    {"label": "Form", "value": "Lyophilized powder"},
    {"label": "Storage", "value": "Refrigerate (36–46°F). Protect from light."},
    {"label": "Reconstitution", "value": "Bacteriostatic water"}
  ]'::jsonb,
  'GLP-3 RT (Retatrutide) — AMINENT LABS',
  'Retatrutide (GLP-3 RT) triple agonist research peptide. 10mg lyophilized, HPLC tested, COA available. For Research Use Only.',
  'Triple agonist research peptide targeting GLP-1, GIP, and glucagon receptors. 10mg lyophilized powder, HPLC tested.',
  true,
  true,
  0
),

-- 2. BPC-157
(
  'bpc157',
  'BPC-157',
  'BPC-157',
  '<p>BPC-157 (Body Protection Compound-157) is a pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) found in human gastric juice. BPC-157 has been studied extensively in research settings for its effects on tissue repair, wound healing, and cytoprotective properties.</p><p>This peptide is supplied as a lyophilized powder for reconstitution in research settings. A full certificate of analysis is available on our site.</p>',
  '10 mg | Lyophilized Powder | RUO Peptide',
  42.00,
  '10 mg',
  '≥99%',
  'Lyophilized powder',
  'Refrigerate (36–46°F). Protect from light.',
  'Bacteriostatic water',
  'tissue',
  'transBPC.png',
  NULL,
  '[
    {"label": "Molecular Formula", "value": "Not applicable (pentadecapeptide)"},
    {"label": "Molecular Weight", "value": "1419.53 g/mol"},
    {"label": "Sequence", "value": "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val"},
    {"label": "Purity", "value": "≥99% (HPLC)"},
    {"label": "Form", "value": "Lyophilized powder"},
    {"label": "Storage", "value": "Refrigerate (36–46°F). Protect from light."},
    {"label": "Reconstitution", "value": "Bacteriostatic water"}
  ]'::jsonb,
  'BPC-157 — AMINENT LABS',
  'BPC-157 Body Protection Compound-157 pentadecapeptide. 10mg lyophilized, HPLC tested, COA available. For Research Use Only.',
  'Body Protection Compound-157, a pentadecapeptide for gastric and tissue repair research. 10mg lyophilized powder, HPLC tested.',
  true,
  true,
  1
),

-- 3. GHK-Cu
(
  'ghkcu',
  'GHK-Cu',
  'GHK-Cu',
  '<p>GHK-Cu (glycyl-L-histidyl-L-lysine copper) is a naturally occurring copper complex of the tripeptide GHK. First identified in human plasma, GHK-Cu has been extensively studied for its roles in tissue remodeling, wound repair signaling, and antioxidant enzyme regulation.</p><p>This peptide is supplied as a lyophilized powder for reconstitution in research settings. A full certificate of analysis is available on our site.</p>',
  '50 mg | Lyophilized Powder | RUO Peptide',
  38.00,
  '50 mg',
  '≥99%',
  'Lyophilized powder',
  'Refrigerate (36–46°F). Protect from light.',
  'Bacteriostatic water',
  'tissue',
  'transGHKCU.png',
  NULL,
  '[
    {"label": "Molecular Formula", "value": "C₁₄H₂₃CuN₆O₄"},
    {"label": "Molecular Weight", "value": "403.92 g/mol"},
    {"label": "Purity", "value": "≥99% (HPLC)"},
    {"label": "Form", "value": "Lyophilized powder"},
    {"label": "Storage", "value": "Refrigerate (36–46°F). Protect from light."},
    {"label": "Reconstitution", "value": "Bacteriostatic water"}
  ]'::jsonb,
  'GHK-Cu — AMINENT LABS',
  'GHK-Cu copper peptide complex. 50mg lyophilized, HPLC tested, COA available. For Research Use Only.',
  'Copper peptide complex studied for tissue remodeling and antioxidant enzyme regulation. 50mg lyophilized powder, HPLC tested.',
  true,
  true,
  2
);
