import { LocationPoint } from "@prisma/client";

export interface Flight {
    id: number;
    startLocationId: number;
    endLocationId: number;
    company?: string;
    companyLogo?: string;
    startDate: Date;
    endDate:Date;
    twoWay?: boolean;
    numberOfPeople?: number;
    optionId?: number;
    price: number;
   
  }