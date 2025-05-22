import React from 'react';

export interface Station {
  id: number;
  name: string;
  managerName: string;
  managerPhone: string;
  address: string;
  managerPhoto?: string;
  active: boolean;
  tanks: Tank[];
  staff: Staff[];
  dispensers: Dispenser[];
  sales: SalesEntry[];
  expenses: Expense[];
  financialReports: FinancialReport[];
}

export interface Staff {
  id: number;
  stationId: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  photo?: string;
  dateEmployed: string;
  guarantor: {
    name: string;
    phone: string;
    email: string;
    address: string;
    relationship: string;
  };
}

export interface PriceHistory {
  id: number;
  tankId: number;
  price: number;
  timestamp: string;
}

export interface VolumeLog {
  id: number;
  tankId: number;
  previousVolume: number;
  newVolume: number;
  timestamp: string;
  stationId: number;
}

export interface Tank {
  id: number;
  stationId: number;
  name: string;
  capacity: number;
  currentVolume: number;
  productType: "PMS" | "AGO";
  lastUpdated: string;
  status: "Active" | "Inactive" | "Maintenance";
  sellingPrice: number;
  expectedRevenue: number;
  salesStartTime?: string;
  estimatedSalesEndTime?: string;
  secretKey?: string;
  priceHistory: PriceHistory[];
  volumeLog: VolumeLog[];
}

export interface TankOffload {
  id: number;
  tankId: number;
  orderId: number;
  openingVolume: number;
  offloadVolume: number;
  finalVolume: number;
  dateTime: string;
}

export interface PurchaseOrder {
  id: number;
  stationId: number;
  stationName: string;
  productType: "PMS" | "AGO";
  supplierDetails: {
    name: string;
    phone: string;
    address: string;
  };
  driverDetails: {
    name: string;
    phone: string;
    truckInfo: string;
    gpsTrackerId: string;
  };
  productCostPerUnit: number;
  totalVolume: number;
  totalCost: number;
  transportCost: number;
  finalTotalCost: number;
  sellingPricePerUnit: number;
  expectedRevenue: number;
  dateCreated: string;
  timeCreated: string;
  status: "Pending" | "Active" | "Completed" | "Rejected";
  rejectionReason?: string;
  receipts?: {
    payment?: string;
    cash?: string;
    transfer?: string;
    pos?: string;
  };
}

export interface DriverOffload {
  id: number;
  orderId: number;
  driverName: string;
  dateTime: string;
  volumeArrived: number;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Notification {
  id: number;
  stationId: number;
  title: string;
  message: string;
  dateTime: string;
  read: boolean;
  type: "Order" | "Offload" | "Payment" | "Tank" | "Other";
}

export interface Dispenser {
  id: number;
  stationId: number;
  name: string;
  productType: "PMS" | "AGO";
  tankId: number;
  nozzles: Nozzle[];
  volumeLog: DispenserVolumeLog[];
}

export interface Nozzle {
  id: number;
  dispenserId: number;
  name: string;
  openingReading: number;
  closingReading: number;
}

export interface DispenserVolumeLog {
  id: number;
  dispenserId: number;
  nozzleId: number;
  previousReading: number;
  newReading: number;
  volumeSold: number;
  timestamp: string;
}

export interface SalesEntry {
  id: number;
  stationId: number;
  staffId: number;
  dispenserId: number;
  nozzleId: number;
  shift: 'Morning' | 'Afternoon';
  openingReading: number;
  closingReading: number;
  volumeSold: number;
  revenue: number;
  date: string;
  time: string;
}

export interface Expense {
  id: number;
  stationId: number;
  category: 'Utilities' | 'Maintenance' | 'Salary' | 'Other';
  amount: number;
  notes: string;
  date: string;
}

export interface FinancialReport {
  id: number;
  stationId: number;
  date: string;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  productBreakdown: {
    pms: {
      volume: number;
      revenue: number;
    };
    ago: {
      volume: number;
      revenue: number;
    };
  };
}