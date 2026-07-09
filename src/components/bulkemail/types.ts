export interface EmailFormState {
  subject: string;
  body: string;
  recipientMode: 'test' | 'all';
  testEmails: string[];
}
