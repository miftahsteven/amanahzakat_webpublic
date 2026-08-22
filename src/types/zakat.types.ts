export type ZakatCategoryTab = "maal" | "profesi" | "fitrah";

export interface ZakatCalculationResult {
  isEligible: boolean;
  totalAssetsOrIncome: number;
  nisabThreshold: number;
  zakatAmount: number;
  formattedZakat: string;
  formattedBase: string;
  formattedNisab: string;
  notes: string;
}

export interface ZakatMaalFormValues {
  cashAndSavings: number;
  goldAndPreciousMetals: number;
  depositsAndInvestments: number;
  shortTermLiabilities: number;
}

export interface ZakatProfesiFormValues {
  monthlyIncome: number;
  otherIncome: number;
  monthlyBasicNeeds: number;
}

export interface ZakatFitrahFormValues {
  personCount: number;
  ricePricePerKg: number;
}
