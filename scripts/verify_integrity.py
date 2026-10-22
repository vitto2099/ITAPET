import json
import collections

with open('web/public/data/registros_historicos.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

print(f"Total records: {len(records)}")
assert len(records) == 1363, f"Expected 1363, got {len(records)}"

# Check IDs
ids = [r['id'] for r in records]
assert len(ids) == len(set(ids)), "Duplicate IDs found!"
for idx, r in enumerate(records, start=1):
    expected_id = f"hist_{idx:04d}"
    assert r['id'] == expected_id, f"ID mismatch at {idx}: expected {expected_id}, got {r['id']}"

# Check fields
species_counts = collections.Counter(r['especie'] for r in records)
sex_counts = collections.Counter(r['sexo'] for r in records)
empty_chips = [r['id'] for r in records if not r.get('microchip')]
empty_pets = [r['id'] for r in records if not r.get('nomeAnimal')]
empty_tutors = [r['id'] for r in records if not r.get('nomeTutor')]

print("Species count:", dict(species_counts))
print("Sex count:", dict(sex_counts))
print("Empty microchips:", len(empty_chips))
print("Empty pet names:", len(empty_pets))
print("Empty tutor names:", len(empty_tutors))

print("\nAll integrity checks passed successfully!")
