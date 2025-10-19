export type Detection = {
  label: string;
  score: number; // 0..1 confidence
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
};
