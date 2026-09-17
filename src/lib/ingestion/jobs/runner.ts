export interface JobContext {
  jobId: string;
  source: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  metrics: {
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
  };
}

export class IngestionJobRunner {
  private context: JobContext;
  
  constructor(source: string) {
    this.context = {
      jobId: 'job-' + Date.now(),
      source,
      startedAt: new Date(),
      status: 'running',
      metrics: { processed: 0, created: 0, updated: 0, skipped: 0, failed: 0 }
    };
  }
  
  trackProcessed() { this.context.metrics.processed++; }
  trackCreated() { this.context.metrics.created++; }
  trackUpdated() { this.context.metrics.updated++; }
  trackSkipped() { this.context.metrics.skipped++; }
  trackFailed() { this.context.metrics.failed++; }
  
  async complete() {
    this.context.status = 'completed';
    this.context.completedAt = new Date();
    return this.context;
  }
  
  async fail(error: unknown) {
    this.context.status = 'failed';
    this.context.completedAt = new Date();
    console.error('Job failed:', error);
    return this.context;
  }
}
