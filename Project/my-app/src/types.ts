// src/types.ts
export type HeaterProduct = {
  ID: number;
  Title: string;
  Image?: string;
  Power?: string;
  Description?: string;
  Efficiency?: string;
};

export type RequestHeater = {
  HeatersProductRequestID?: number;
  HeatersProductID?: number;
  HeaterProduct: HeaterProduct;
  Area?: string | number;
};

export type Request = {
  ID: number;
  PlaceSquare?: number;
  OutsideTemperature?: number;
  InsideTemperature?: number;
  RequestHeaters?: RequestHeater[];
};
