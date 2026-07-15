export type BoardSchema = Record<
    string, 
    { 
        readonly displayName: string; 
        readonly prevStateId: string | null; 
        readonly nextStateId: string | null; 
    }
>;