import os
import re
import json
from datetime import datetime
import pypdf

FOLDER = r"C:\Users\MeioAmbiente\.gemini\antigravity\brain\44c46f36-16ed-4b30-b482-b607e0c8b17b\.user_uploaded"
JSON_PATH = r"c:\Users\MeioAmbiente\Desktop\DEV\ITAPET\web\public\data\registros_historicos.json"

def clean_str(s):
    if not s:
        return ""
    # Map corrupt accents to UTF-8
    replacements = {
        "": "",
        "Fmea": "Fêmea",
        "Fmea": "Fêmea",
        "FÊmea": "Fêmea",
        "Tigro": "Tigrão",
        "Zlia": "Zélia",
        "Maurcio": "Maurício",
        "Antnio": "Antônio",
        "Tet": "Teté",
        "Mcula": "Mácula",
        "Andr": "André",
        "Sar": "Safir",
        "Srd": "SRD",
        "Dashund": "Dachshund",
        "Dash": "Dachshund",
        "PIncher": "Pinscher",
        "Pinchter": "Pinscher",
        "Itaipolis": "Itaiópolis",
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s.strip()

def parse_date_iso(date_str):
    try:
        parts = date_str.split('/')
        if len(parts) == 3:
            day, month, year = parts
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}T12:00:00.000Z"
    except:
        pass
    return "2026-04-13T12:00:00.000Z"

def run_merge():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        existing_records = json.load(f)
    
    print(f"Initial records in database: {len(existing_records)}")
    
    # Map microchip to record
    chip_map = {}
    for r in existing_records:
        chip = r.get("microchip", "").strip()
        if chip:
            chip_map[chip] = r

    pdf_files = [f for f in os.listdir(FOLDER) if f.endswith('.pdf') and f != 'media_1792518546682_1c948524.pdf']
    
    added_count = 0
    updated_count = 0
    next_id_num = len(existing_records) + 1

    for pdf in sorted(pdf_files):
        path = os.path.join(FOLDER, pdf)
        reader = pypdf.PdfReader(path)
        
        for p_idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            for line in text.split("\n"):
                line = line.strip()
                m_start = re.match(r"^(\d{1,3})\s+(\d{2}[/\.]\d{2}[/\.]\d{4}\'?)\s+(.*)$", line)
                if not m_start:
                    continue
                idx = m_start.group(1)
                date = m_start.group(2).replace("'", "").replace(".", "/")
                rest = m_start.group(3).strip()
                
                tokens = rest.split()
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
                        esp_raw = after_chip[0].lower()
                        especie = "Canino" if "can" in esp_raw else "Felino"
                        
                        sex_raw = after_chip[1].lower()
                        sexo = "Fêmea" if "f" in sex_raw else "Macho"
                        
                        peso_str = after_chip[2].replace(",", ".")
                        try:
                            peso = float(peso_str)
                        except:
                            peso = 5.0
                        
                        raca = clean_str(after_chip[3].upper())
                        remainder = after_chip[4:]
                        
                        valor = 180.0
                        if remainder and re.match(r"^\d+[\.,]\d{2}$", remainder[-1]):
                            try:
                                valor = float(remainder[-1].replace(",", "."))
                            except:
                                valor = 180.0
                            remainder = remainder[:-1]
                        
                        if len(remainder) >= 2:
                            nome_animal = clean_str(remainder[0])
                            nome_tutor = clean_str(" ".join(remainder[1:]))
                        elif len(remainder) == 1:
                            nome_animal = clean_str(remainder[0])
                            nome_tutor = "Não Especificado"
                        else:
                            nome_animal = "Sem Nome"
                            nome_tutor = "Não Especificado"
                        
                        # Fix single names
                        if not nome_animal or nome_animal == "":
                            nome_animal = "Pet Sem Nome"
                        if not nome_tutor or nome_tutor == "":
                            nome_tutor = "Não Especificado"

                        if chip in chip_map:
                            # Update existing record if needed
                            ex = chip_map[chip]
                            if ex.get("nomeAnimal", "") == "Sem Nome" or not ex.get("nomeAnimal"):
                                ex["nomeAnimal"] = nome_animal
                            if ex.get("nomeTutor", "") in ["Não Informado", "Não Especificado", ""] and nome_tutor != "Não Especificado":
                                ex["nomeTutor"] = nome_tutor
                            if not ex.get("senhaAtendimento") or ex.get("senhaAtendimento") == "00":
                                ex["senhaAtendimento"] = senha
                            updated_count += 1
                        else:
                            # Create new record
                            rec_id = f"hist_{str(next_id_num).zfill(4)}"
                            next_id_num += 1
                            new_rec = {
                                "id": rec_id,
                                "idOriginal": f"{pdf[:15]}_{idx}",
                                "senhaAtendimento": senha,
                                "microchip": chip,
                                "especie": especie,
                                "sexo": sexo,
                                "pesoKg": peso,
                                "raca": raca if raca else "SRD",
                                "nomeAnimal": nome_animal,
                                "nomeTutor": nome_tutor,
                                "valorProcedimento": valor,
                                "dataProcedimento": date,
                                "dataProcedimentoISO": parse_date_iso(date),
                                "bairro": "Itaiópolis - Centro e Interior",
                                "status": "concluido",
                                "origem": f"mutirao_pdf_{pdf}",
                                "alertaDuplicidadeMicrochip": False,
                                "fotosPet": [],
                                "vacinas": [
                                    {
                                        "nome": "Castração e Microchipagem Municipal",
                                        "data": date,
                                        "observacao": f"Procedimento do Mutirão Municipal sob senha {senha}. Valor: R$ {valor:.2f}"
                                    }
                                ],
                                "criadoEm": parse_date_iso(date)
                            }
                            existing_records.append(new_rec)
                            chip_map[chip] = new_rec
                            added_count += 1

    print(f"\nMerge Complete!")
    print(f"Updated existing records: {updated_count}")
    print(f"Brand new records added: {added_count}")
    print(f"Total animals in final database: {len(existing_records)}")
    
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_records, f, indent=2, ensure_ascii=False)
    print(f"Saved to {JSON_PATH} successfully!")

if __name__ == "__main__":
    run_merge()
