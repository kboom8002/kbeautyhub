export type TemplateFieldRule = 'invariant' | 'overridable';

export type TemplateDef = {
  template_id: string;
  object_type: string;
  base_payload: Record<string, any>;
  rules: Record<string, TemplateFieldRule>;
};

export class TemplateRegistry {
  private static templates: TemplateDef[] = [
    {
      template_id: 'TMPL-ANS-FIT-004',
      object_type: 'AnswerObject',
      base_payload: {
        canonical_question_id: 'CQ-FIT-004',
        title: 'Is this for sensitive skin?',
        answer_short: '[Brand to fill]',
        answer_full: '[Brand to fill detailed explanation]',
        fit_summary: {
          recommended_for: [],
          not_for: ['Recent severe irritation'] // Built-in boundary invariant
        }
      },
      rules: {
        'canonical_question_id': 'invariant',
        'title': 'invariant',
        'answer_short': 'overridable',
        'answer_full': 'overridable',
        'fit_summary.recommended_for': 'overridable',
        'fit_summary.not_for': 'invariant' // Brands cannot remove the system 'not_for'
      }
    }
  ];

  static get(template_id: string): TemplateDef | null {
    return this.templates.find(t => t.template_id === template_id) || null;
  }

  static getAll(): TemplateDef[] {
    return this.templates;
  }
}
