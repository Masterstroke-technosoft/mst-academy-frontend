export interface EmailFormState {
  subject: string;
  body: string;
  recipientMode: 'test' | 'all' | 'csv';
  testEmails: string[];
  csvEmails: string[];
}
