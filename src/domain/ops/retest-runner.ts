export type RetestRun = {
  retest_run_id: string;
  patch_ticket_id: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'inconclusive';
  created_at: string;
};

export class RetestRunner {
  private static retestStore: RetestRun[] = [];

  static createRun(patch_ticket_id: string): RetestRun {
    const run: RetestRun = {
      retest_run_id: `RTR-${Date.now()}`,
      patch_ticket_id,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.retestStore.push(run);
    return run;
  }

  static mockExecuteRun(retest_run_id: string, simulateSuccess: boolean = true) {
    const run = this.retestStore.find(r => r.retest_run_id === retest_run_id);
    if (!run) throw new Error("Retest not found");

    run.status = simulateSuccess ? 'passed' : 'failed';
    return run;
  }

  static getRun(retest_run_id: string) {
    return this.retestStore.find(r => r.retest_run_id === retest_run_id);
  }

  static getStore() {
    return this.retestStore;
  }
}
