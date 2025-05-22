class AuthService {
  private static instance: AuthService;
  private passwords: Record<number, string> = {};

  private constructor() {
    // Initialize complex passwords with a mix of uppercase, lowercase, numbers, and special characters
    this.passwords = {
      1: 'CEO#Nipco2025!', // CEO password
      2: 'Station2@Abk#2025', // Station 2 password (Abakiliki)
      3: 'Station3$Uyo1#25', // Station 3 password (Uyo 1)
      4: 'Station4@Uyo2#25', // Station 4 password (Uyo 2)
      5: 'Station5$Ikot#25', // Station 5 password (Ikot-Ekpene)
    };
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  validatePassword(stationId: number, password: string): boolean {
    return this.passwords[stationId] === password;
  }

  changePassword(stationId: number, oldPassword: string, newPassword: string): boolean {
    if (this.validatePassword(stationId, oldPassword)) {
      this.passwords[stationId] = newPassword;
      return true;
    }
    return false;
  }
}

export default AuthService;