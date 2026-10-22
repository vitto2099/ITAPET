import os
import re
import json
import sys
import pypdf
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\MeioAmbiente\.gemini\antigravity\brain\44c46f36-16ed-4b30-b482-b607e0c8b17b\.user_uploaded"
JSON_PATH = r"c:\Users\MeioAmbiente\Desktop\DEV\ITAPET\web\public\data\registros_historicos.json"

FILES = [
    (
        os.path.join(BASE_DIR, "media_1792672062170_59e1ddfd.pdf"),
        "media_1792672062170_59e1ddfd.pdf",
        "15/10/2026",
        "2026-10-15T12:00:00.000Z"
    ),
    (
        os.path.join(BASE_DIR, "media_1792672062171_0072ce22.pdf"),
        "media_1792672062171_0072ce22.pdf",
        "16/10/2026",
        "2026-10-16T12:00:00.000Z"
    ),
    (
        os.path.join(BASE_DIR, "media_1792672062172_be862bcc.pdf"),
        "media_1792672062172_be862bcc.pdf",
        "17/10/2026",
        "2026-10-17T12:00:00.000Z"
    )
]

def get_col(x):
    if x < 50:
        return 'item'
    elif x < 140:
        return 'data_proc'
    elif x < 210:
        return 'senha'
    elif x < 360:
        return 'microchip'
    elif x < 460:
        return 'especie'
    elif x < 540:
        return 'sexo'
    elif x < 620:
        return 'peso'
    elif x < 740:
        return 'nome_animal'
    elif x < 950:
        return 'nome_tutor'
    else:
        return 'valor'

def normalize_text(s):
    if not s:
        return ""
    # Standardize casing and trim
    s = s.strip()
    return s

def normalize_especie(esp):
    esp = esp.lower()
    if 'canin' in esp or 'cão' in esp or 'cao' in esp or 'cachorr' in esp:
        return 'Canino'
    if 'felin' in esp or 'gat' in esp:
        return 'Felino'
    return 'Canino'

def normalize_sexo(sex):
    sex = sex.lower()
    if 'fem' in sex or 'fêm' in sex:
        return 'Fêmea'
    if 'mach' in sex:
        return 'Macho'
    return 'Fêmea'

def main():
    print("Iniciando ingestão dos 3 novos mutirões (15/10/2026, 16/10/2026 e 17/10/2026)...")
    
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        existing_records = json.load(f)
    if len(existing_records) > 1038:
        print(f"Truncando registros existentes para os 1.038 originais (estava com {len(existing_records)}).")
        existing_records = existing_records[:1038]
    print(f"Base histórica base: {len(existing_records)} animais cadastrados.")
    
    existing_chips = set(p['microchip'] for p in existing_records)
    all_chips = set(existing_chips)
    
    new_records = []
    
    for file_path, fname, default_date, date_iso in FILES:
        reader = pypdf.PdfReader(file_path)
        file_extracted = []
        
        for page_idx, page in enumerate(reader.pages):
            elems = []
            def visitor(text, cm, tm, font_dict, font_size):
                t = text.strip()
                if t:
                    elems.append((tm[4], tm[5], t))
            page.extract_text(visitor_text=visitor)
            
            elems_by_y = sorted(elems, key=lambda e: e[1])
            row_clusters = []
            for x, y, t in elems_by_y:
                placed = False
                for cluster in row_clusters:
                    if abs(cluster['y'] - y) < 4:
                        cluster['elems'].append((x, y, t))
                        placed = True
                        break
                if not placed:
                    row_clusters.append({'y': y, 'elems': [(x, y, t)]})
            
            # Sort each row cluster left to right
            for cluster in row_clusters:
                row_elems = sorted(cluster['elems'], key=lambda e: e[0])
                cols = defaultdict(list)
                for x, y, t in row_elems:
                    cols[get_col(x)].append(t)
                
                row_data = {c: ' '.join(cols[c]).strip() for c in cols}
                
                if 'microchip' in row_data:
                    clean_chip = re.sub(r'\D', '', row_data['microchip'])
                    if len(clean_chip) >= 10:
                        file_extracted.append(row_data)
        
        print(f"-> Arquivo {fname}: {len(file_extracted)} registros extraídos com sucesso.")
        
        for r in file_extracted:
            chip = re.sub(r'\D', '', r['microchip'])
            esp = normalize_especie(r.get('especie', ''))
            sex = normalize_sexo(r.get('sexo', ''))
            
            peso_raw = r.get('peso', '0').replace(',', '.')
            try:
                peso = round(float(peso_raw), 2)
            except ValueError:
                peso = 0.0
                
            valor_raw = r.get('valor', '180,00').replace('.', '').replace(',', '.')
            try:
                valor = round(float(valor_raw), 2)
            except ValueError:
                valor = 180.0
                
            nome_animal = normalize_text(r.get('nome_animal', 'Sem Nome'))
            nome_tutor = normalize_text(r.get('nome_tutor', 'Munícipe de Itaiópolis'))
            senha = r.get('senha', r.get('item', ''))
            data_proc = r.get('data_proc', default_date)
            
            is_dup = chip in all_chips
            all_chips.add(chip)
            
            new_id_num = len(existing_records) + len(new_records) + 1
            new_id = f"hist_{new_id_num:04d}"
            
            rec = {
                "id": new_id,
                "idOriginal": f"{fname.replace('.pdf', '')}_{r.get('item', str(new_id_num))}",
                "senhaAtendimento": senha,
                "microchip": chip,
                "especie": esp,
                "sexo": sex,
                "pesoKg": peso,
                "raca": "SRD",
                "nomeAnimal": nome_animal,
                "nomeTutor": nome_tutor,
                "valorProcedimento": valor,
                "dataProcedimento": data_proc,
                "dataProcedimentoISO": date_iso,
                "bairro": "Itaiópolis (Mutirão Municipal)",
                "status": "concluido",
                "origem": f"mutirao_pdf_{fname}",
                "alertaDuplicidadeMicrochip": is_dup,
                "fotosPet": [],
                "vacinas": [
                    {
                        "nome": "Castração e Microchipagem Municipal",
                        "data": data_proc,
                        "observacao": f"Procedimento do Mutirão Municipal sob senha {senha}. Valor: R$ {valor:.2f}"
                    }
                ],
                "criadoEm": date_iso
            }
            new_records.append(rec)
            
    print(f"\nTotal de novos registros preparados: {len(new_records)}")
    
    # Validações de integridade
    assert len(new_records) == 325, f"Esperado 325 registros, obtido {len(new_records)}"
    
    caninos_count = sum(1 for r in new_records if r['especie'] == 'Canino')
    felinos_count = sum(1 for r in new_records if r['especie'] == 'Felino')
    print(f"Distribuição dos novos registros: {caninos_count} Caninos | {felinos_count} Felinos")
    
    # Combina com a base existente
    consolidated = existing_records + new_records
    print(f"Nova base histórica total: {len(consolidated)} animais.")
    
    # Salva o arquivo atualizado
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(consolidated, f, ensure_ascii=False, indent=2)
    print(f"Arquivo salvo com sucesso em: {JSON_PATH}")
    
    # Mostra primeiros 3 e últimos 3 dos novos registros
    print("\n--- AMOSTRA DOS NOVOS REGISTROS ---")
    for r in new_records[:3]:
        print(f"  [{r['id']}] {r['nomeAnimal']} ({r['especie']}, {r['sexo']}, {r['pesoKg']}kg) - Chip: {r['microchip']} | Tutor: {r['nomeTutor']} | Data: {r['dataProcedimento']}")
    print("  ...")
    for r in new_records[-3:]:
        print(f"  [{r['id']}] {r['nomeAnimal']} ({r['especie']}, {r['sexo']}, {r['pesoKg']}kg) - Chip: {r['microchip']} | Tutor: {r['nomeTutor']} | Data: {r['dataProcedimento']}")

if __name__ == "__main__":
    main()
