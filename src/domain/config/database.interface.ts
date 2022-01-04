export interface DatabaseConfig {
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
  getDatabaseSync(): boolean;
  getSecretCaptchaKey(): string;
  getMailHost(): string;
  getMailPort(): number;
  getMailUser(): string;
  getMailPassword(): string;
  getMailFrom(): string;
}
