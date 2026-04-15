export class BrandService {
  
  static async getTestScopedObjects(brand_id: string, canonical_question_id?: string) {
    // Return empty array, not explicitly used in Sandbox since we mocked it in page.tsx
    return [];
  }

  static async getAllBrands() {
    return [
      { brand_id: 'BRAND-GOOD', name: 'Brand Good', readiness_score: 95 },
      { brand_id: 'BRAND-POPULAR', name: 'K-Beauty Popular', readiness_score: 88 },
      { brand_id: 'BRAND-TRENDING', name: 'Trending Derma', readiness_score: 91 },
      { brand_id: 'BRAND-BAD', name: 'High Risk Cosmetics', readiness_score: 30 }
    ];
  }

  static async setMockObjects(brand_id: string, objects: any[]) {
    // dummy legacy mock
    return true;
  }
}
