import os
import re
import json
import pypdf

FOLDER = r"C:\Users\MeioAmbiente\.gemini\antigravity\brain\44c46f36-16ed-4b30-b482-b607e0c8b17b\.user_uploaded"
HISTORICAL_JSON = r"c:\Users\MeioAmbiente\Desktop\DEV\ITAPET\web\public\data\registros_historicos.json"

def clean_text(s):
    if not s:
        return ""
    # Fix common encoding artifacts
    s = s.replace("Fmea", "Fêmea").replace("Fmea", "Fêmea").replace("FÊmea", "Fêmea")
    s = s.replace("Tigro", "Tigrão").replace("Zlia", "Zélia").replace("Felin", "Felino")
    s = s.replace("Itaipolis", "Itaiópolis").replace("Itaipolis", "Itaiópolis")
    s = s.replace("Maurcio", "Maurício").replace("Antnio", "Antônio")
    s = s.replace("Tet", "Teté").replace("Mcula", "Mácula").replace("Andr", "André")
    s = s.replace("Sar", "Safir").replace("Srd", "SRD")
    return s.strip()

def parse_all_pdfs():
    pdf_files = [f for f in os.listdir(FOLDER) if f.endswith('.pdf') and f != 'media_1792518546682_1c948524.pdf']
    all_parsed = []
    
    for pdf in sorted(pdf_files):
        path = os.path.join(FOLDER, pdf)
        reader = pypdf.PdfReader(path)
        print(f"Reading {pdf} ({len(reader.pages)} pages)...")
        
        for p_idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            for line in text.split("\n"):
                line = line.strip()
                # Check for line starting with index and date
                m_start = re.match(r"^(\d{1,3})\s+(\d{2}[/\.]\d{2}[/\.]\d{4}\'?)\s+(.*)$", line)
                if not m_start:
                    continue
                idx = m_start.group(1)
                date = m_start.group(2).replace("'", "").replace(".", "/")
                rest = m_start.group(3).strip()
                
                tokens = rest.split()
                # Look for token with digits >= 10 (microchip)
                chip_idx = -1
                for i, tok in enumerate(tokens[:4]):
                    clean_tok = re.sub(r"\D", "", tok)
                    if len(clean_tok) >= 10:
                        chip_idx = i
                        break
                
                if chip_idx != -1:
                    senha = " ".join(tokens[:chip_idx]) if chip_idx > 0 else idx
                    chip = re.sub(r"\D", "", tokens[chip_idx])
                    after_chip = tokens[chip_idx+1:]
                    
                    if len(after_chip) >= 4:
                        especie = after_chip[0]
                        # Normalize especie
                        if "can" in especie.lower():
                            especie = "Canino"
                        elif "fel" in especie.lower():
                            especie = "Felino"
                        
                        sexo = after_chip[1]
                        if "f" in sexo.lower():
                            sexo = "Fêmea"
                        elif "m" in sexo.lower():
                            sexo = "Macho"
                        
                        peso_str = after_chip[2].replace(",", ".")
                        try:
                            peso = float(peso_str)
                        except:
                            peso = 5.0
                        
                        raca = after_chip[3].upper()
                        if raca == "SRD" or raca == "SRD":
                            raca = "SRD"
                        
                        remainder = after_chip[4:]
                        valor = 180.0
                        if remainder and re.match(r"^\d+[\.,]\d{2}$", remainder[-1]):
                            try:
                                valor = float(remainder[-1].replace(",", "."))
                            except:
                                valor = 180.0
                            remainder = remainder[:-1]
                        
                        if len(remainder) >= 2:
                            nome_animal = clean_text(remainder[0])
                            nome_tutor = clean_text(" ".join(remainder[1:]))
                        elif len(remainder) == 1:
                            nome_animal = clean_text(remainder[0])
                            nome_tutor = "Não Especificado"
                        else:
                            nome_animal = "Sem Nome"
                            nome_tutor = "Não Especificado"
                        
                        all_parsed.append({
                            "source_pdf": pdf,
                            "index_pdf": idx,
                            "data_proc": date,
                            "senha": senha,
                            "microchip": chip,
                            "especie": especie,
                            "sexo": sexo,
                            "pesoKg": peso,
                            "raca": raca,
                            "nomeAnimal": nome_animal,
                            "nomeTutor": nome_tutor,
                            "valorProcedimento": valor
                        })
                    else:
                        print("Skipped line (too short after chip):", line)
                else:
                    print("Skipped line (no chip found):", line)
                    
    print(f"\nTotal parsed records from PDFs: {len(all_parsed)}")
    return all_parsed

if __name__ == "__main__":
    records = parse_all_pdfs()
    print("Sample record:", json.dumps(records[0], indent=2, ensure_ascii=False))
