import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { ObjectService } from '../domain/objects/service';

async function loadObjectSeeds() {
  console.log("Loading Object Seeds...");
  const objectSeedPath = path.resolve(process.cwd(), 'seeds/04_kbeauty_object_seed.yaml');

  if (fs.existsSync(objectSeedPath)) {
    const fileContent = fs.readFileSync(objectSeedPath, 'utf8');
    const doc = yaml.parse(fileContent);

    console.log(`Parsed ${doc.objects.length} Objects from seed.`);

    for (const obj of doc.objects) {
      try {
        await ObjectService.upsert(obj);
        console.log(`Imported ${obj.object_id} (${obj.object_type})`);
      } catch (err: any) {
        console.error(`Error loading object ${obj.object_id}:`, err.message);
      }
    }
  }

  console.log("Object Seed loading complete.");
}

// Allow running from command line
if (require.main === module) {
  loadObjectSeeds().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export { loadObjectSeeds };
