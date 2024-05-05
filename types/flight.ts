import { LocationPoint } from "@prisma/client";

export interface Flight {
    id: number;
    startLocationId: number;
    endLocationId: number;
    company?: string;
    companyLogo?: string;
    date: Date;
    twoWay?: boolean;
    numberOfPeople?: number;
    optionId?: number;
    price: number;
   
  }