import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { CanonicalQuestionService } from '../domain/canonical-question';
import { QISSceneService } from '../domain/qis-scene';

async function loadSeeds() {
  console.log("Loading Domain Seeds...");
  const cqSeedPath = path.resolve(process.cwd(), 'seeds/02_kbeauty_cq_seed.yaml');
  const sceneSeedPath = path.resolve(process.cwd(), 'seeds/03_kbeauty_scene_seed.yaml');

  // Load CQ
  if (fs.existsSync(cqSeedPath)) {
    const cqFile = fs.readFileSync(cqSeedPath, 'utf8');
    const cqDoc = yaml.parse(cqFile);
    console.log(`Parsed ${cqDoc.canonical_questions.length} CQs from seed.`);
    for (const cq of cqDoc.canonical_questions) {
      await CanonicalQuestionService.upsert({
        canonical_question_id: cq.id,
        vertical_id: cqDoc.vertical_id,
        family_code: cq.family,
        title: cq.title,
        signature: `${cqDoc.vertical_id}-${cq.family}-${cq.title}`,
        primary_object_type: cq.primary_object_type,
        secondary_object_types: cq.secondary_object_types || [],
        layer: cq.layer,
        priority: cq.priority === 'P1' ? 1 : 2,
        risk_level: cq.risk_level,
        status: 'ACTIVE'
      });
    }
  }

  // Load Scene
  if (fs.existsSync(sceneSeedPath)) {
    const sceneFile = fs.readFileSync(sceneSeedPath, 'utf8');
    const sceneDoc = yaml.parse(sceneFile);
    console.log(`Parsed ${sceneDoc.scenes.length} Scenes from seed.`);
    for (const scene of sceneDoc.scenes) {
      await QISSceneService.upsert({
        scene_id: scene.id,
        canonical_question_id: scene.canonical_question_id,
        scene_title: scene.scene_title,
        representative_query: scene.representative_query,
        intent: scene.intent,
        scenario: scene.scenario,
        persona_origin: scene.persona_origin,
        decision_stage: scene.decision_stage,
        risk_level: scene.risk_level,
        trust_requirement: scene.trust_requirement,
        required_objects: scene.required_objects,
        surface_targets: scene.surface_targets,
        primary_success_metric: scene.primary_success_metric,
        status: 'ACTIVE'
      });
    }
  }

  console.log("Seed loading complete.");
}

// Allow running from command line
if (require.main === module) {
  loadSeeds().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export { loadSeeds };
