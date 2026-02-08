
export enum LetterType {
  R1 = 'R1 - Peringatan Pertama',
  R2 = 'R2 - Peringatan Kedua',
  R3 = 'R3 - Peringatan Terakhir'
}

export interface LetterFormData {
  letterType: LetterType;
  dateOfLetter: string;
  parentName: string;
  address: string;
  studentName: string;
  studentClass: string;
  absenceDates: string[];
  logoUrl?: string;
  // Specific to R2
  dateOfR1?: string;
  // Specific to R3
  dateOfR2?: string;
  attendanceFrom?: string;
  attendanceTo?: string;
  totalDaysPresent?: string;
  totalSchoolDays?: string;
}
